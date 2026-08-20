"use client";

import React, { useState } from "react";
import { FilePlus, FolderPlus, Search, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileTreeItem, FileNode } from "./file-tree-item";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  files: FileNode[];
  activePath: string;
  onSelectFile: (node: FileNode) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function FileExplorer({
  files,
  activePath,
  onSelectFile,
  isCollapsed,
  onToggleCollapse,
  className,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    app: true,
    components: true,
    public: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleToggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  if (isCollapsed) {
    return (
      <div className={cn("h-full border-r border-border/80 bg-background/95 flex flex-col items-center py-3 gap-3 w-10 shrink-0", className)}>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg"
          title="Expand File Explorer"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full w-[240px] shrink-0 bg-background border-r border-border/80 select-none min-w-0 min-h-0", className)}>
      {/* Explorer Header */}
      <div className="h-10 border-b border-border/80 px-3 flex items-center justify-between shrink-0 bg-background/95">
        <span className="text-xs font-semibold text-foreground tracking-tight">Files</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-foreground h-6 w-6 rounded-md"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-foreground h-6 w-6 rounded-md"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowSearch(!showSearch)}
            className={cn(
              "h-6 w-6 rounded-md transition-colors",
              showSearch ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            title="Search Files"
          >
            <Search className="w-3.5 h-3.5" />
          </Button>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onToggleCollapse}
              className="text-muted-foreground hover:text-foreground h-6 w-6 rounded-md hidden md:flex"
              title="Collapse File Explorer"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-2 border-b border-border/60 bg-muted/30">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="h-7 text-xs pr-6"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-1.5">
        {files.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            activePath={activePath}
            onSelectFile={onSelectFile}
            expandedFolders={expandedFolders}
            onToggleFolder={handleToggleFolder}
          />
        ))}
      </div>
    </div>
  );
}
