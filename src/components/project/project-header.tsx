"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Code2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenerationStatus, ProjectStatus } from "./generation-status";
import { cn } from "@/lib/utils";

export type WorkspaceViewMode = "code" | "preview";

interface ProjectHeaderProps {
  projectName: string;
  subtitle?: string;
  status: ProjectStatus;
  activeView: WorkspaceViewMode;
  onViewChange: (view: WorkspaceViewMode) => void;
  onBack?: () => void;
  className?: string;
}

export function ProjectHeader({
  projectName,
  subtitle = "V0-AI Project Workspace",
  status,
  activeView,
  onViewChange,
  onBack,
  className,
}: ProjectHeaderProps) {
  return (
    <header className={cn("h-14 w-full shrink-0 border-b border-border/80 bg-background/95 backdrop-blur-sm px-4 flex items-center justify-between select-none transition-colors", className)}>
      {/* Left side: Back, Title, Subtitle, Status */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack ? (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground rounded-lg"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-xs"
            asChild
            className="text-muted-foreground hover:text-foreground rounded-lg"
            title="Back to Dashboard"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-foreground truncate">
                {projectName}
              </h1>
              <GenerationStatus status={status} />
            </div>
            <span className="text-[11px] text-muted-foreground/80 font-normal leading-none hidden sm:block truncate">
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Code/Preview mode toggle & actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle pill button */}
        <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
          <button
            onClick={() => onViewChange("code")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
              activeView === "code"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
          <button
            onClick={() => onViewChange("preview")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
              activeView === "preview"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* More options menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground rounded-lg h-8 w-8"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Export Project</DropdownMenuItem>
            <DropdownMenuItem>Project Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
