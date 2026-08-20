"use client";

import React from "react";
import { CodeWorkspace } from "./code-workspace";
import { PreviewWorkspace } from "./preview-workspace";
import { WorkspaceViewMode } from "./project-header";
import { FileNode } from "./file-tree-item";
import { cn } from "@/lib/utils";

interface WorkspacePanelProps {
  activeView: WorkspaceViewMode;
  files: FileNode[];
  activeFile: FileNode | null;
  onSelectFile: (file: FileNode) => void;
  className?: string;
}

export function WorkspacePanel({
  activeView,
  files,
  activeFile,
  onSelectFile,
  className,
}: WorkspacePanelProps) {
  return (
    <div className={cn("flex flex-1 min-w-0 min-h-0 h-full overflow-hidden", className)}>
      {activeView === "code" ? (
        <CodeWorkspace
          files={files}
          activeFile={activeFile}
          onSelectFile={onSelectFile}
          className="flex flex-1 min-w-0 min-h-0 h-full"
        />
      ) : (
        <PreviewWorkspace className="flex flex-1 min-w-0 min-h-0 h-full" />
      )}
    </div>
  );
}

