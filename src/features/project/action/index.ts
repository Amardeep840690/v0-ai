"use server";
import { fragments, messages, projects } from "@/db/schema";
import { getCurrentUser } from "@/features/auth/action";
import { inngest } from "@/features/inngest/client";
import { db } from "@/index";
import { desc, eq, and, asc } from "drizzle-orm";
import { Sandbox } from "@e2b/code-interpreter";
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
      await inngest.send({
        name: "app/task.created",
        data: {
          projectId: project.id,
          prompt: trimmedPrompt,
        },
      });
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
      return {
        error: "Project not found",
      };
    }
    const projectMessage = await db
      .select()
      .from(messages)
      .where(eq(messages.projectId, project.id))
      .orderBy(asc(messages.createdAt));

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

export const getLatestProject = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const [latestProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.updatedAt))
      .limit(1);

    return latestProject ?? null;
  } catch (error) {
    console.error("Error fetching latest project:", error);

    return {
      error: "Failed to fetch latest project",
    };
  }
};

export const deleteProject = async (projectId: string) => {
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
      .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
      .limit(1);

    if (!project) {
      return {
        error: "Project not found",
      };
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ Error deleting project:", error);

    return {
      error: "Failed to delete project",
    };
  }
};

export const renameProject = async (projectId: string, projectName: string) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const name = projectName.trim();

    if (!name) {
      return {
        error: "Project name cannot be empty",
      };
    }

    const [project] = await db
      .update(projects)
      .set({ name, updatedAt: new Date() })
      .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
      .returning();

    if (!project) {
      return {
        error: "Project not found",
      };
    }

    return project;
  } catch (error) {
    console.error("❌ Error renaming project:", error);

    return {
      error: "Failed to rename project",
    };
  }
};

interface CreateMessageParams {
  projectId: string;
  content: string;
  role: "USER" | "ASSISTANT";
  type: "RESULT" | "ERROR";
}

export const createMessage = async ({
  projectId,
  content,
  role,
  type,
}: CreateMessageParams) => {
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
      .where(and(eq(projects.userId, user.id), eq(projects.id, projectId)));

    if (!project) {
      return {
        error: "Project not found",
      };
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return {
        error: "Message cannot be empty",
      };
    }

    const [createdMessage] = await db
      .insert(messages)
      .values({
        content: trimmedContent,
        role,
        type,
        projectId,
      })
      .returning();

    return createdMessage;
  } catch (error) {
    console.error("❌ Error creating message:", error);

    return {
      error: "Failed to save message",
    };
  }
};

export const createDirectMessage = async ({
  projectId,
  content,
  role,
  type,
}: CreateMessageParams) => {
  try {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return {
        error: "Message cannot be empty",
      };
    }

    const [createdMessage] = await db
      .insert(messages)
      .values({
        content: trimmedContent,
        role,
        type,
        projectId,
      })
      .returning();

    return createdMessage;
  } catch (error) {
    console.error("❌ Error creating direct message:", error);
    return {
      error: "Failed to save direct message",
    };
  }
};

export const startprojectTask = async (
  projectId: string,
  text: string,
  taskId: string,
) => {
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
      .where(and(eq(projects.userId, user.id), eq(projects.id, projectId)));

    if (!project) {
      return {
        error: "Project not found",
      };
    }

    await inngest.send({
      name: "app/task.created",
      data: {
        projectId,
        prompt: text,
        taskId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Error starting project task:", error);
    return {
      error: "Failed to start task",
    };
  }
};

export const stopProjectTask = async (taskId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    const result = await inngest.send({
      name: "app/task.cancelled",
      data: {
        taskId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Error stopping project task:", error);
    return {
      error: "Failed to stop task",
    };
  }
};

export interface FileChange {
  type: "CREATE" | "UPDATE" | "MOVE" | "DELETE";
  oldPath: string | null;
  newPath: string | null;
  content?: string;
}

interface SaveFragmentsMessageProps {
  messageId: string;
  projectId: string;
  changes: FileChange[];
}

export const saveFragmentsMessage = async ({
  messageId,
  projectId,
  changes,
}: SaveFragmentsMessageProps) => {
  // Get the latest fragment for this project
  const [previousFragment] = await db
    .select({
      id: fragments.id,
      files: fragments.files,
      messageId: fragments.messageId,
    })
    .from(fragments)
    .innerJoin(messages, eq(fragments.messageId, messages.id))
    .where(eq(messages.projectId, projectId))
    .orderBy(desc(fragments.createdAt))
    .limit(1);

  // If this is the first fragment, start with empty files
  const previousFiles = previousFragment?.files ?? {};

  // Copy previous files into a new object
  const file: Record<string, string> = {
    ...(previousFiles as Record<string, string>),
  };

  // Apply AI changes
  for (const change of changes) {
    switch (change.type) {
      case "CREATE": {
        if (!change.newPath || change.content === undefined) {
          throw new Error("CREATE requires newPath and content");
        }

        file[change.newPath] = change.content;
        break;
      }

      case "UPDATE": {
        if (
          !change.oldPath ||
          !change.newPath ||
          change.content === undefined
        ) {
          throw new Error("UPDATE requires oldPath, newPath and content");
        }

        delete file[change.oldPath];

        file[change.newPath] = change.content;
        break;
      }

      case "MOVE": {
        if (
          !change.oldPath ||
          !change.newPath ||
          change.content === undefined
        ) {
          throw new Error("MOVE requires oldPath, newPath and content");
        }

        delete file[change.oldPath];

        file[change.newPath] = change.content;
        break;
      }

      case "DELETE": {
        if (!change.oldPath) {
          throw new Error("DELETE requires oldPath");
        }

        delete file[change.oldPath];
        break;
      }
    }
  }

  // Create a new fragment
  const [newFragment] = await db
    .insert(fragments)
    .values({
      messageId,
      title: "New Fragment",
      files: file,
    })
    .returning();

  return newFragment;
};

export const getLatestFragment = async (projectId: string) => {
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
      .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)));

    if (!project) {
      return {
        error: "Project not found",
      };
    }

    const [fragment] = await db
      .select({
        id: fragments.id,
        messageId: fragments.messageId,
        sandboxUrl: fragments.sandboxUrl,
        title: fragments.title,
        files: fragments.files,
        createdAt: fragments.createdAt,
        updatedAt: fragments.updatedAt,
      })
      .from(fragments)
      .innerJoin(messages, eq(fragments.messageId, messages.id))
      .where(eq(messages.projectId, projectId))
      .orderBy(desc(fragments.createdAt))
      .limit(1);

    if (!fragment) {
      return {
        error: "Fragment not found",
      };
    }

    return fragment;
  } catch (error) {
    console.error("❌ Error getting latest fragment:", error);

    return {
      error: "Failed to get latest fragment",
    };
  }
};

export const createPreviewSandbox = async (files: Record<string, string>) => {
  const sandbox = await Sandbox.create({
    template: "v0-ai-nextjs",
  });

  console.log("Sandbox created:", sandbox.sandboxId);

  for (const [filePath, content] of Object.entries(files)) {
    console.log("Writing:", filePath);

    await sandbox.files.write(filePath, content);
  }

  const page = await sandbox.files.read("app/page.tsx");

  console.log("PREVIEW PAGE:", page);

  const sandboxUrl = `http://${sandbox.getHost(3000)}`;

  console.log("Preview URL:", sandboxUrl);

  return {
    sandboxId: sandbox.sandboxId,
    sandboxUrl,
  };
};

export const updateFragmentSandboxUrl = async (
  fragmentId: string,
  sandboxUrl: string,
) => {
  const [updatedFragment] = await db
    .update(fragments)
    .set({
      sandboxUrl,
    })
    .where(eq(fragments.id, fragmentId))
    .returning();

  return updatedFragment;
};
