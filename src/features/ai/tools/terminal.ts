import { Sandbox } from "e2b";

export async function runTerminalCommand(sandboxId: string, command: string) {
  const sandbox = await Sandbox.connect(sandboxId);

  try {
    const result = await sandbox.commands.run(command, {
      timeoutMs: 120_000,
    });

    return {
      command,
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    return {
      command,
      exitCode: -1,
      stdout: "",
      stderr: error instanceof Error ? error.message : "Command failed",
    };
  }
}
