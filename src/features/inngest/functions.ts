import {
  createDirectMessage,
  saveFragmentsMessage,
  updateFragmentSandboxUrl,
  createPreviewSandbox,
} from "../project/action/index";

import { inngest } from "./client";
import { generateCodeResponse } from "../ai/openai";
import { getOrCreateSandbox } from "../ai/tools/sandbox";

export const processTask = inngest.createFunction(
  {
    id: "process-task",

    triggers: [{ event: "app/task.created" }],

    cancelOn: [
      {
        event: "app/task.cancelled",
        if: "async.data.taskId == event.data.taskId",
      },
    ],
  },

  async ({ event, step }) => {
    const { projectId, prompt, taskId } = event.data;

    try {
      const { sandboxId } = await step.run("get-sandbox", async () => {
        return getOrCreateSandbox(projectId);
      });

      console.log("Sandbox ID:", sandboxId);

      /*
       * 2. Ask AI agent to work on the project
       *
       * AI has access to:
       * - listFiles
       * - readFiles
       * - createOrUpdateFiles
       * - terminal
       *
       * The tools operate directly on this sandbox.
       */
      const aiResponse = await step.run("generate-ai-response", async () => {
        return generateCodeResponse({
          prompt,
          sandboxId,
        });
      });

      console.log("AI Response:", aiResponse);

      /*
       * 3. Save assistant response
       */
      const assistantMessage = await step.run(
        "save-assistant-message",
        async () => {
          return createDirectMessage({
            projectId,
            content: aiResponse.assistantMessage,
            role: "ASSISTANT",
            type: "RESULT",
          });
        },
      );

      if ("error" in assistantMessage) {
        throw new Error(assistantMessage.error);
      }

      if (aiResponse.changes.length > 0) {
        const fragment = await step.run("save-fragment", async () => {
          return saveFragmentsMessage({
            messageId: assistantMessage.id,
            projectId,
            changes: aiResponse.changes,
          });
        });

        const preview = await step.run("create-preview", async () => {
          return createPreviewSandbox(fragment.files as Record<string, string>);
        });

        console.log("Preview URL:", preview.sandboxUrl);

        /*
         * 6. Save preview URL in fragment
         */
        await step.run("save-preview-url", async () => {
          return updateFragmentSandboxUrl(fragment.id, preview.sandboxUrl);
        });
      }

      return {
        processed: true,
        projectId,
        taskId,
        sandboxId,
      };
    } catch (error) {
      console.error("❌ Error in processTask:", error);

      /*
       * Save error message
       */
      await step.run("save-error-message", async () => {
        return createDirectMessage({
          projectId,
          content: "Failed to process request. Please try again.",
          role: "ASSISTANT",
          type: "ERROR",
        });
      });

      return {
        processed: false,
        projectId,
        taskId,
        error: "Task failed",
      };
    }
  },
);
