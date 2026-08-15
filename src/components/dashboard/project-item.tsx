"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useDeleteProject } from "@/features/project/hooks/project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RenameProjectDialog } from "@/components/dashboard/rename-project-dialog";

interface ProjectItemProps {
  id: string;
  title: string;
  updatedAt: Date | string;
  active: boolean;
}

export function ProjectItem({
  id,
  title,
  updatedAt,
  active,
}: ProjectItemProps) {
  const router = useRouter();

  const [renameOpen, setRenameOpen] = useState(false);

  const { mutate: deleteProject, isPending } = useDeleteProject();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );

    if (!confirmed) return;

    deleteProject(id, {
      onSuccess: () => {
        toast.success("Project deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleOpen = () => {
    router.push(`/projects/${id}`);
  };

  const handleRename = () => {
    setRenameOpen(true);
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-card/80 hover:shadow-soft",
          active && "bg-accent/60",
        )}
      >
        {/* Active Indicator */}
        {active && (
          <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-primary" />
        )}

        <div className="min-w-0 flex-1 pl-2">
          <p className="truncate text-[15px] font-semibold text-foreground">
            {title}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Updated{" "}
            {formatDistanceToNow(new Date(updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpen}>Open</DropdownMenuItem>

            <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rename Dialog */}
      <RenameProjectDialog
        projectId={id}
        currentName={title}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
    </>
  );
}
