"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProjectStatus = "Ready" | "Generating" | "Completed" | "Error";

interface GenerationStatusProps {
  status: ProjectStatus;
  className?: string;
}

export function GenerationStatus({ status, className }: GenerationStatusProps) {
  switch (status) {
    case "Ready":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-primary/10 text-primary border-primary/20 font-medium px-2.5 py-0.5 text-xs rounded-full gap-1.5",
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Ready
        </Badge>
      );
    case "Generating":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium px-2.5 py-0.5 text-xs rounded-full gap-1.5",
            className
          )}
        >
          <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
          Generating
        </Badge>
      );
    case "Completed":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium px-2.5 py-0.5 text-xs rounded-full gap-1.5",
            className
          )}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          Completed
        </Badge>
      );
    case "Error":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-destructive/10 text-destructive border-destructive/20 font-medium px-2.5 py-0.5 text-xs rounded-full gap-1.5",
            className
          )}
        >
          <AlertTriangle className="w-3 h-3 text-destructive" />
          Error
        </Badge>
      );
    default:
      return null;
  }
}
