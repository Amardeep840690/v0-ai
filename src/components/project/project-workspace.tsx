"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Code2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

import { ProjectHeader, WorkspaceViewMode } from "./project-header";

import { ChatPanel } from "./chat-panel";
import { WorkspacePanel } from "./workspace-panel";
import { ProjectStatus } from "./generation-status";
import { FileNode } from "./file-tree-item";
import { useGetProjectById } from "@/features/project/hooks/project";
import { stopProjectTask } from "@/features/project/action";

// Mock files for now.
// Later these will come from the database/project files.
const MOCK_FILES: FileNode[] = [];

interface ProjectWorkspaceProps {
  projectId: string;
  initialGenerating?: boolean;
}

export function ProjectWorkspace({
  projectId,
  initialGenerating = false,
}: ProjectWorkspaceProps) {
  // Current view: Code or Preview
  const [activeView, setActiveView] = useState<WorkspaceViewMode>("code");

  // Project generation status
  const [status, setStatus] = useState<ProjectStatus>(
    initialGenerating ? "Generating" : "Ready",
  );

  // Project files
  const [files] = useState<FileNode[]>(MOCK_FILES);

  // Currently selected file
  // null because we don't have generated files yet
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);

  // Mobile navigation
  const [mobileTab, setMobileTab] = useState<"chat" | "workspace">("workspace");

  const generatingStartTimeRef = useRef<number | null>(
    initialGenerating ? Date.now() - 5000 : null,
  );
  const generatingTaskIdRef = useRef<string | null>(null);

  const {
    data: projectData,
    isLoading,
    isError,
  } = useGetProjectById(projectId, {
    refetchInterval: status === "Generating" ? 1500 : false,
  });

  useEffect(() => {
    if (
      status === "Generating" &&
      projectData?.message &&
      projectData.message.length > 0 &&
      generatingStartTimeRef.current !== null
    ) {
      const lastMessage = projectData.message[projectData.message.length - 1];
      const messageTime = new Date(lastMessage.createdAt).getTime();

      if (
        lastMessage.role === "ASSISTANT" &&
        messageTime >= generatingStartTimeRef.current
      ) {
        setStatus("Completed");
        generatingStartTimeRef.current = null;
        generatingTaskIdRef.current = null;
      }
    }
  }, [projectData?.message, status]);

  // Send prompt
  const handleSendPrompt = (promptText: string, taskId: string) => {
    generatingTaskIdRef.current = taskId;
    generatingStartTimeRef.current = Date.now();
    setStatus("Generating");
  };

  // Stop generation
  const handleStopGeneration = async () => {
    const taskId = generatingTaskIdRef.current;
    generatingTaskIdRef.current = null;
    generatingStartTimeRef.current = null;
    setStatus("Ready");

    if (taskId) {
      await stopProjectTask(taskId);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Project Header */}
      <ProjectHeader
        projectName={projectData?.project?.name ?? ""}
        subtitle="V0-AI Project Workspace"
        status={status}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Workspace */}
      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* ========================= */}
        {/* Desktop */}
        {/* ========================= */}

        <div className="hidden h-full min-h-0 min-w-0 w-full md:flex">
          {/* AI Chat */}
          <ChatPanel
            status={status}
            projectId={projectId}
            chatHistory={projectData?.message ?? []}
            onSendPrompt={handleSendPrompt}
            onStopGeneration={handleStopGeneration}
            className="h-full w-[400px] shrink-0"
          />

          {/* Code / Preview Workspace */}
          <WorkspacePanel
            activeView={activeView}
            files={files}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            className="h-full min-h-0 min-w-0 flex-1"
          />
        </div>

        {/* ========================= */}
        {/* Mobile */}
        {/* ========================= */}

        <div className="flex h-full w-full flex-col md:hidden">
          {/* Mobile Content */}
          <div className="min-h-0 flex-1 overflow-hidden">
            {mobileTab === "chat" ? (
              <ChatPanel
                status={status}
                projectId={projectId}
                chatHistory={projectData?.message ?? []}
                onSendPrompt={handleSendPrompt}
                onStopGeneration={handleStopGeneration}
                className="h-full"
              />
            ) : (
              <WorkspacePanel
                activeView={activeView}
                files={files}
                activeFile={activeFile}
                onSelectFile={setActiveFile}
                className="h-full"
              />
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex h-12 shrink-0 items-center justify-around border-t border-border bg-background px-2">
            {/* Chat */}
            <button
              type="button"
              onClick={() => setMobileTab("chat")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                mobileTab === "chat"
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <MessageSquare className="size-4" />

              <span>AI Chat</span>
            </button>

            {/* Workspace */}
            <button
              type="button"
              onClick={() => setMobileTab("workspace")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                mobileTab === "workspace"
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {activeView === "code" ? (
                <Code2 className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}

              <span>
                {activeView === "code" ? "Code Workspace" : "Live Preview"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
