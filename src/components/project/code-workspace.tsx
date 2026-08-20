"use client";

import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileExplorer } from "./file-explorer";
import { CodeEditor } from "./code-editor";
import { FileNode } from "./file-tree-item";
import { cn } from "@/lib/utils";

interface CodeWorkspaceProps {
  files: FileNode[];
  activeFile: FileNode | null;
  onSelectFile: (file: FileNode) => void;
  className?: string;
}

export function CodeWorkspace({
  files,
  activeFile,
  onSelectFile,
  className,
}: CodeWorkspaceProps) {
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(false);

  return (
    <div className={cn("flex flex-1 min-w-0 min-h-0 h-full overflow-hidden bg-background", className)}>
      <FileExplorer
        files={files}
        activePath={activeFile?.path || "components/Navbar.tsx"}
        onSelectFile={onSelectFile}
        isCollapsed={isExplorerCollapsed}
        onToggleCollapse={() => setIsExplorerCollapsed(!isExplorerCollapsed)}
        className={isExplorerCollapsed ? "w-10 shrink-0 h-full" : "w-[240px] shrink-0 h-full"}
      />
      <CodeEditor
        activeFile={activeFile}
        className="flex-1 min-w-0 min-h-0 h-full"
      />
    </div>
  );
}

