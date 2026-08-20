"use client";

import React from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface FileTreeItemProps {
  node: FileNode;
  activePath: string;
  onSelectFile: (node: FileNode) => void;
  expandedFolders: Record<string, boolean>;
  onToggleFolder: (path: string) => void;
  level?: number;
}

export function FileTreeItem({
  node,
  activePath,
  onSelectFile,
  expandedFolders,
  onToggleFolder,
  level = 0,
}: FileTreeItemProps) {
  const isFolder = node.type === "folder";
  const isExpanded = !!expandedFolders[node.path];
  const isActive = activePath === node.path;

  const getFileIcon = (name: string) => {
    if (name.endsWith(".json")) return <FileJson className="w-3.5 h-3.5 text-amber-500" />;
    if (name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".jsx") || name.endsWith(".js"))
      return <FileCode className="w-3.5 h-3.5 text-emerald-500" />;
    if (name.endsWith(".css")) return <FileText className="w-3.5 h-3.5 text-sky-500" />;
    if (name.endsWith(".svg") || name.endsWith(".png") || name.endsWith(".jpg"))
      return <ImageIcon className="w-3.5 h-3.5 text-purple-500" />;
    return <FileText className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="select-none">
      <div
        onClick={() => {
          if (isFolder) {
            onToggleFolder(node.path);
          } else {
            onSelectFile(node);
          }
        }}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        className={cn(
          "flex items-center gap-1.5 py-1 pr-2 text-xs rounded-md cursor-pointer transition-colors my-0.5",
          isActive
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {isFolder ? (
          <>
            <span className="text-muted-foreground/70 shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            {getFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
          </>
        )}
      </div>

      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              activePath={activePath}
              onSelectFile={onSelectFile}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
