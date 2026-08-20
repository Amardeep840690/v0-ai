import {
  createDirectMessage,
  saveFragmentsMessage,
  FileChange,
} from "../project/action/index";
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
      const dummyAIResponse: {
        assistantMessage: string;
        changes: FileChange[];
      } = {
        assistantMessage:
    "I've renamed Hero.tsx to LandingHero.tsx and updated the project reference.",

  changes: [
    {
      type: "MOVE",
      oldPath: "components/Hero.tsx",
      newPath: "components/LandingHero.tsx",
      content: `export function LandingHero() {
  return (
    <section className="px-6 py-24 text-center">
      <p className="mb-3 text-sm font-medium">
        Freshly roasted every morning
      </p>

      <h2 className="text-5xl font-bold">
        Your perfect cup starts here.
      </h2>
    </section>
  );
}`,
    },

    {
      type: "UPDATE",
      oldPath: "app/page.tsx",
      newPath: "app/page.tsx",
      content: `import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { Products } from "@/components/Products";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <LandingHero />
      <Products />
      <Pricing />
      <Footer />
    </main>
  );
}`,
    },
  ],
      };

      // Save assistant response to DB
      const assistantMessage = await step.run(
        "save-assistant-message",
        async () => {
          return createDirectMessage({
            projectId,
            content: dummyAIResponse.assistantMessage,
            role: "ASSISTANT",
            type: "RESULT",
          });
        },
      );

      if ("error" in assistantMessage) {
        throw new Error(assistantMessage.error);
      }

      if (dummyAIResponse.changes.length > 0) {
        await step.run("save-fragment", async () => {
          return saveFragmentsMessage({
            messageId: assistantMessage.id,
            projectId,
            changes: dummyAIResponse.changes,
          });
        });
      }

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
