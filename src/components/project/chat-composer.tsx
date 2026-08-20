"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, ImageIcon, ArrowUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || disabled) return;
    onSend(prompt.trim());
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 border-t border-border/60 bg-background/95 backdrop-blur-xs shrink-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="bg-card border border-border/80 rounded-2xl p-2.5 shadow-xs focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to build or modify something..."
            rows={2}
            className="w-full min-h-[50px] max-h-[140px] resize-none bg-transparent border-none p-1 focus-visible:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground/60 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-1">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg"
                title="Attach file"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg"
                title="Attach image"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={!prompt.trim() || disabled}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3.5 h-7 rounded-lg gap-1.5 shadow-xs transition-all disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground/60">
          <span>Enter to send</span>
          <span>Shift + Enter for new line</span>
        </div>
      </form>
    </div>
  );
}
