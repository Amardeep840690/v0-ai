import { Sandbox } from "e2b";

export async function listFiles(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);

  const result = await sandbox.commands.run(
    `find /home/user -type f \
    -not -path '/home/user/.bun/*' \
    -not -path '/home/user/.cache/*' \
    -not -path '/home/user/.config/*' \
    -not -path '/home/user/.local/*' \
    -not -path '/home/user/node_modules/*' \
    -not -path '/home/user/.next/*' \
    -not -path '/home/user/.git/*' \
    -not -name '.bash_logout' \
    -not -name '.bashrc' \
    -not -name '.profile' \
    | sed 's|/home/user/||' \
    | sort`,
  );

  if (result.exitCode !== 0) {
    throw new Error(result.stderr || "Failed to list files");
  }

  return result.stdout
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean)
    .map((path) => ({
      path,
    }));
}
