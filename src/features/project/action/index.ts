"use server";
import { messages, projects } from "@/db/schema";
import { getCurrentUser } from "@/features/auth/action";
import { db } from "@/index";
import { desc, eq } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";

export const createProject = async (projectName?: string, prompt?: string) => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: "Unauthorized",
    };
  }
  try {
    const trimmedProjectName = projectName?.trim() ?? "";
    const trimmedPrompt = prompt?.trim() ?? "";
    if (!trimmedProjectName && !trimmedPrompt) {
      return {
        error: "Please enter a project name or a prompt.",
      };
    }
    let slug = trimmedProjectName || generateSlug(2, { format: "kebab" });

    const project = await db.transaction(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({
          name: slug,
          userId: user.id,
        })
        .returning();

      if (trimmedPrompt) {
        await tx.insert(messages).values({
          content: trimmedPrompt,
          role: "USER",
          type: "RESULT",
          projectId: project.id,
        });
      }

      return project;
    });

    if (trimmedPrompt) {
      // await inngest.send()
    }

    return project;
  } catch (error) {
    console.error("❌ Error creating project:", error);
    return {
      error: "Failed to create project",
    };
  }
};

export const getProjects = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.createdAt));

    return allProjects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return {
      error: "Failed to fetch projects",
    };
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project) {
    }
    const projectMessage = await db
      .select()
      .from(messages)
      .where(eq(messages.projectId, project.id));

    return {
      project,
      message: projectMessage,
    };
  } catch (error) {
    console.error("❌ Error getting project by id:", error);
    return {
      error: "Failed to get project by id",
    };
  }
};
