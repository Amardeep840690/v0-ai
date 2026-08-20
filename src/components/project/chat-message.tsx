"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageProps } from "./chat-panel";

export function ChatMessage({ role, content, type, createdAt, updatedAt }: MessageProps) {
  if (role === "USER") {
    return (
      <div className="flex flex-col items-end my-2">
        <div className="max-w-[88%] bg-muted/80 border border-border/60 text-foreground px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start my-2">
      <div className="w-full bg-card/70 border border-border/80 text-foreground p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs space-y-2">
        {type && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3" />
            <span>{type}</span>
          </div>
        )}
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
