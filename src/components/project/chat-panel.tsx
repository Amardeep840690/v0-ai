"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Plus, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./chat-message";
import { ChatActivity, ActivityItem } from "./chat-activity";
import { ChatComposer } from "./chat-composer";
import { ProjectStatus } from "./generation-status";
import { cn } from "@/lib/utils";
import { useCreateMessage } from "@/features/project/hooks/project";
import { startprojectTask } from "@/features/project/action";

export interface MessageProps {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  type: "RESULT" | "ERROR";
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatPanelProps {
  status: ProjectStatus;
  projectId: string;
  chatHistory: MessageProps[];
  onSendPrompt?: (prompt: string, taskId: string) => void;
  onStopGeneration?: () => void;
  onNewChat?: () => void;
  className?: string;
}

export function ChatPanel({
  status,
  projectId,
  chatHistory,
  onSendPrompt,
  onStopGeneration,
  onNewChat,
  className,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<MessageProps[]>(chatHistory);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const [activities] = useState<ActivityItem[]>([]);
  const { mutateAsync: createMessage } = useCreateMessage();

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || status === "Generating") return;

    const taskId = crypto.randomUUID();

    try {
      const tempMessage: MessageProps = {
        id: crypto.randomUUID(),
        content: trimmed,
        role: "USER",
        type: "RESULT",
        projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Show immediately
      setMessages((prev) => [...prev, tempMessage]);

      // Set status to Generating
      onSendPrompt?.(trimmed, taskId);

      // Save user message to DB
      await createMessage({
        projectId,
        content: trimmed,
        role: "USER",
        type: "RESULT",
      });

      // Trigger Inngest background task on server
      const res = await startprojectTask(projectId, trimmed, taskId);
      if (res && "error" in res && res.error) {
        console.error("Failed to start project task:", res.error);
        onStopGeneration?.();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      onStopGeneration?.();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full w-[340px] shrink-0 bg-background border-r border-border/80 min-h-0 select-none",
        className,
      )}
    >
      {/* Chat Header */}
      <div className="h-12 border-b border-border/80 px-4 flex items-center justify-between shrink-0 bg-background/95">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Assistant
          </span>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-medium">
            Active
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onNewChat}
          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg"
          title="New conversation"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Conversation Messages */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}

        {/* Developer Activity Cards */}
        {activities.length > 0 && (
          <div className="my-3">
            <div className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-2 px-1">
              Generated Updates
            </div>
            <ChatActivity items={activities} />
          </div>
        )}

        {/* Generation loading/completed state card */}
        {status === "Generating" && (
          <div className="p-3 bg-card border border-border/80 rounded-2xl flex items-center justify-between my-2 shadow-2xs animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-foreground font-medium flex items-center gap-1.5">
                Updating files
                <span className="flex gap-0.5">
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </span>
              </span>
            </div>
            {onStopGeneration && (
              <Button
                variant="outline"
                size="xs"
                onClick={onStopGeneration}
                className="h-6 text-[10px] gap-1 text-destructive hover:bg-destructive/10"
              >
                <StopCircle className="w-3 h-3" />
                Stop
              </Button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Anchored Chat Composer */}
      <ChatComposer
        onSend={handleSendMessage}
        disabled={status === "Generating"}
      />
    </div>
  );
}
