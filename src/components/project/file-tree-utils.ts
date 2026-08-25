import { FileNode } from "./file-tree-item";

export function buildFileTree(files: Record<string, string>): FileNode[] {
  const root: FileNode[] = [];

  for (const [filePath, content] of Object.entries(files)) {
    const parts = filePath.split("/");
    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      const isFile = index === parts.length - 1;

      let existingNode = currentLevel.find((node) => node.path === currentPath);

      if (!existingNode) {
        existingNode = {
          id: currentPath,
          name: part,
          path: currentPath,
          type: isFile ? "file" : "folder",
          ...(isFile
            ? {
                content,
                language: getLanguage(part),
              }
            : {
                children: [],
              }),
        };

        currentLevel.push(existingNode);
      }

      if (!isFile) {
        currentLevel = existingNode.children!;
      }
    });
  }

  return root;
}

function getLanguage(fileName: string): string {
  if (fileName.endsWith(".tsx")) return "typescriptreact";
  if (fileName.endsWith(".ts")) return "typescript";
  if (fileName.endsWith(".jsx")) return "javascriptreact";
  if (fileName.endsWith(".js")) return "javascript";
  if (fileName.endsWith(".json")) return "json";
  if (fileName.endsWith(".css")) return "css";
  if (fileName.endsWith(".html")) return "html";
  if (fileName.endsWith(".md")) return "markdown";

  return "plaintext";
}
