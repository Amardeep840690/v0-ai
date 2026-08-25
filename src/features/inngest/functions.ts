import {
  createDirectMessage,
  saveFragmentsMessage,
  FileChange,
  createPreviewSandbox,
  updateFragmentSandboxUrl,
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

      // Dummy AI response content
      const dummyAIResponse: {
        assistantMessage: string;
        changes: FileChange[];
      } = {
        assistantMessage:
          "I've created a modern Todo application with add, complete, and delete functionality.",

        changes: [
          {
            type: "CREATE" as const,
            oldPath: null,
            newPath: "app/page.tsx",
            content: `import TodoApp from "@/components/TodoApp";

export default function Home() {
  return <TodoApp />;
}`,
          },

          {
            type: "CREATE" as const,
            oldPath: null,
            newPath: "components/TodoApp.tsx",
            content: `"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "Learn E2B",
      completed: true,
    },
    {
      id: 2,
      text: "Build V0-AI preview",
      completed: false,
    },
  ]);

  const [input, setInput] = useState("");

  const addTodo = () => {
    const text = input.trim();

    if (!text) return;

    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);

    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) =>
      prev.filter((todo) => todo.id !== id),
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-xl border p-6">
        <h1 className="text-3xl font-bold">
          Todo App
        </h1>

        <div className="mt-6 flex gap-2">
          <input
            className="flex-1 rounded-md border px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task..."
          />

          <button
            className="rounded-md bg-black px-4 py-2 text-white"
            onClick={addTodo}
          >
            Add
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />

                <span
                  className={
                    todo.completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }
                >
                  {todo.text}
                </span>
              </label>

              <button
                className="text-sm text-red-500"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
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
        // Save fragment
        const fragment = await step.run("save-fragment", async () => {
          return saveFragmentsMessage({
            messageId: assistantMessage.id,
            projectId,
            changes: dummyAIResponse.changes,
          });
        });

        // Create E2B preview
        const preview = await step.run("create-preview", async () => {
          return createPreviewSandbox(fragment.files as Record<string, string>);
        });

        console.log("Preview URL:", preview.sandboxUrl);

        // Save E2B URL in fragment
        await step.run("save-preview-url", async () => {
          return updateFragmentSandboxUrl(fragment.id, preview.sandboxUrl);
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
