"use client";

import React from "react";
import { FilePlus, Edit3, LayoutGrid, CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "create" | "update" | "layout" | "complete";
  title: string;
  subtitle: string;
  icon?: LucideIcon;
}

interface ChatActivityProps {
  items: ActivityItem[];
}

export function ChatActivity({ items }: ChatActivityProps) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "create":
        return FilePlus;
      case "update":
        return Edit3;
      case "layout":
        return LayoutGrid;
      case "complete":
        return CheckCircle2;
      default:
        return FilePlus;
    }
  };

  return (
    <div className="flex flex-col gap-2 my-3">
      {items.map((item) => {
        const IconComponent = item.icon || getIcon(item.type);
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 bg-card/60 hover:bg-card border border-border/70 rounded-xl transition-all duration-150 shadow-2xs group"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
              <IconComponent className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-foreground tracking-tight truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
