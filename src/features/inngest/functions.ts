import { createDirectMessage } from "../project/action/index";
import { inngest } from "./client";

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
      // Simulate AI generation delay
      await step.sleep("simulate-ai-generation", "5s");

      // Dummy AI response content
      const aiResponse =
        "This is a dummy AI response. Your request was processed successfully.";

      // Save assistant response to DB
      await step.run("save-assistant-message", async () => {
        return await createDirectMessage({
          projectId,
          content: aiResponse,
          role: "ASSISTANT",
          type: "RESULT",
        });
      });

      return {
        processed: true,
        projectId,
      };
    } catch (error) {
      console.error("❌ Error in processTask Inngest function:", error);

      await step.run("save-error-message", async () => {
        return await createDirectMessage({
          projectId,
          content: "Failed to process request. Please try again.",
          role: "ASSISTANT",
          type: "ERROR",
        });
      });

      return {
        processed: false,
        error: "Task failed",
      };
    }
  },
);
