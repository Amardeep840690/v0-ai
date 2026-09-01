import { Sandbox } from "e2b";
import { db } from "@/index";
import { projects, fragments, messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getOrCreateSandbox(projectId: string) {
  const [project] = await db
    .select({
      id: projects.id,
      sandboxId: projects.sandboxId,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    throw new Error("Project not found");
  }

  /*
   * 1. Try existing sandbox
   */
  if (project.sandboxId) {
    try {
      const sandbox = await Sandbox.connect(project.sandboxId);

      console.log("✅ Connected to existing sandbox:", project.sandboxId);

      return {
        sandbox,
        sandboxId: project.sandboxId,
        isNew: false,
      };
    } catch (error) {
      console.log("⚠️ Existing sandbox unavailable:", project.sandboxId);

      console.log("Creating replacement sandbox...");
    }
  }

  /*
   * 2. Get latest fragment
   */
  const [latestFragment] = await db
    .select({
      files: fragments.files,
    })
    .from(fragments)
    .innerJoin(messages, eq(fragments.messageId, messages.id))
    .where(eq(messages.projectId, projectId))
    .orderBy(desc(fragments.createdAt))
    .limit(1);

  /*
   * 3. Create new sandbox
   */
  const sandbox = await Sandbox.create({
    template: "v0-ai-nextjs",
  });

  console.log("✅ New sandbox created:", sandbox.sandboxId);

  /*
   * 4. Restore latest project files
   */
  if (latestFragment?.files) {
    const files = latestFragment.files as Record<string, string>;

    console.log("Restoring files:", Object.keys(files));

    for (const [filePath, content] of Object.entries(files)) {
      await sandbox.files.write(filePath, content);
    }

    console.log("✅ Project files restored");
  }

  /*
   * 5. Save new sandbox ID
   */
  await db
    .update(projects)
    .set({
      sandboxId: sandbox.sandboxId,
    })
    .where(eq(projects.id, projectId));

  console.log("✅ New sandbox ID saved:", sandbox.sandboxId);

  return {
    sandbox,
    sandboxId: sandbox.sandboxId,
    isNew: true,
  };
}
