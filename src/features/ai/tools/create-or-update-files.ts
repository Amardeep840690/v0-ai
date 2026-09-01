import { Sandbox } from "e2b";

export interface FileToWrite {
  path: string;
  content: string;
}

export async function createOrUpdateFiles(
  sandboxId: string,
  files: FileToWrite[],
) {
  const sandbox = await Sandbox.connect(sandboxId);

  const results: {
    path: string;
    success: boolean;
    error?: string;
  }[] = [];

  for (const file of files) {
    try {
      await sandbox.files.write(file.path, file.content);

      results.push({
        path: file.path,
        success: true,
      });
    } catch (error) {
      results.push({
        path: file.path,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}
