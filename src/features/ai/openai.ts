import OpenAI from "openai";
import { z } from "zod";
import { PROMPT } from "./prompt";

import { listFiles } from "./tools/list_files";
import { readFiles } from "./tools/read_files";
import { createOrUpdateFiles } from "./tools/create-or-update-files";
import { runTerminalCommand } from "./tools/terminal";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fileChangeSchema = z.object({
  type: z.enum(["CREATE", "UPDATE", "MOVE", "DELETE"]),
  oldPath: z.string().nullable(),
  newPath: z.string().nullable(),
  content: z.string().optional(),
});

const aiResponseSchema = z.object({
  assistantMessage: z.string(),
  changes: z.array(fileChangeSchema),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

type GenerateCodeParams = {
  prompt: string;
  sandboxId: string;
};

export async function generateCodeResponse({
  prompt,
  sandboxId,
}: GenerateCodeParams): Promise<AIResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const tools: OpenAI.Responses.Tool[] = [
    {
      type: "function",
      name: "listFiles",
      description:
        "List all files in the current Next.js project. Use this when you need to understand the project structure before modifying files.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
      strict: true,
    },

    {
      type: "function",
      name: "readFiles",
      description:
        "Read the contents of one or more files from the current Next.js project. Use listFiles first when you do not know the exact file path.",
      parameters: {
        type: "object",
        properties: {
          files: {
            type: "array",
            description: "Relative paths of the files to read.",
            items: {
              type: "string",
            },
          },
        },
        required: ["files"],
        additionalProperties: false,
      },
      strict: true,
    },

    {
      type: "function",
      name: "createOrUpdateFiles",
      description:
        "Create new files or completely replace the contents of existing files in the current Next.js project.",
      parameters: {
        type: "object",
        properties: {
          files: {
            type: "array",
            description: "Files to create or update.",
            items: {
              type: "object",
              properties: {
                path: {
                  type: "string",
                  description: "Relative file path.",
                },
                content: {
                  type: "string",
                  description: "Complete file content.",
                },
              },
              required: ["path", "content"],
              additionalProperties: false,
            },
          },
        },
        required: ["files"],
        additionalProperties: false,
      },
      strict: true,
    },

    {
      type: "function",
      name: "terminal",
      description:
        "Run a shell command inside the current Next.js sandbox. Use it to install packages or verify the project after changes. Never start or restart the development server.",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "Shell command to execute.",
          },
        },
        required: ["command"],
        additionalProperties: false,
      },
      strict: true,
    },
  ];

  let input: OpenAI.Responses.ResponseInput = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const maxIterations = 10;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const response = await openai.responses.create({
      model: "gpt-5.6",

      instructions: PROMPT,

      tools,

      input,
    });

    const toolCalls = response.output.filter(
      (item) => item.type === "function_call",
    );

    if (toolCalls.length === 0) {
      if (!response.output_text) {
        throw new Error("OpenAI returned an empty response");
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(response.output_text);
      } catch {
        console.error("Invalid OpenAI response:", response.output_text);

        throw new Error("OpenAI returned invalid JSON");
      }

      const result = aiResponseSchema.safeParse(parsed);

      if (!result.success) {
        console.error("Invalid AI response structure:", result.error);

        throw new Error("OpenAI returned an invalid code response");
      }

      return result.data;
    }
    for (const toolCall of toolCalls) {
      input.push({
        type: "function_call",
        call_id: toolCall.call_id,
        name: toolCall.name,
        arguments: toolCall.arguments,
      });

      let result: unknown;

      try {
        const args = JSON.parse(toolCall.arguments);

        switch (toolCall.name) {
          case "listFiles": {
            result = await listFiles(sandboxId);
            break;
          }

          case "readFiles": {
            const parsedArgs = z
              .object({
                files: z.array(z.string()),
              })
              .parse(args);

            result = await readFiles(sandboxId, parsedArgs.files);

            break;
          }

          case "createOrUpdateFiles": {
            const parsedArgs = z
              .object({
                files: z.array(
                  z.object({
                    path: z.string(),
                    content: z.string(),
                  }),
                ),
              })
              .parse(args);

            result = await createOrUpdateFiles(sandboxId, parsedArgs.files);

            break;
          }

          case "terminal": {
            const parsedArgs = z
              .object({
                command: z.string(),
              })
              .parse(args);

            result = await runTerminalCommand(sandboxId, parsedArgs.command);

            break;
          }

          default: {
            result = {
              error: `Unknown tool: ${toolCall.name}`,
            };
          }
        }
      } catch (error) {
        result = {
          error:
            error instanceof Error ? error.message : "Tool execution failed",
        };
      }

      input.push({
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: JSON.stringify(result),
      });
    }
  }

  throw new Error("OpenAI exceeded the maximum number of tool iterations");
}
