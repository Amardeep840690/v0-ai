import { Sandbox } from "e2b";

export async function readFiles(sandboxId: string, files: string[]) {
  const sandbox = await Sandbox.connect(sandboxId);

  const result: {
    path: string;
    content: string;
  }[] = [];

  for (const filePath of files) {
    try {
      const content = await sandbox.files.read(filePath);

      result.push({
        path: filePath,
        content,
      });
    } catch (error) {
      result.push({
        path: filePath,
        content: `Unable to read file: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  return result;
}
