"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRenameProject } from "@/features/project/hooks/project";

interface RenameProjectDialogProps {
  projectId: string;
  currentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameProjectDialog({
  projectId,
  currentName,
  open,
  onOpenChange,
}: RenameProjectDialogProps) {
  const [projectName, setProjectName] = useState(currentName);

  const { mutate: renameProject, isPending } = useRenameProject();

  const handleRename = () => {
    const name = projectName.trim();

    if (!name) {
      toast.error("Please enter a project name");
      return;
    }

    if (name === currentName) {
      onOpenChange(false);
      return;
    }

    renameProject(
      {
        projectId,
        projectName: name,
      },
      {
        onSuccess: () => {
          toast.success("Project renamed successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-5 text-primary" />
            Rename Project
          </DialogTitle>

          <DialogDescription>
            Enter a new name for your project.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            autoFocus
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
              }
            }}
            className="h-12 rounded-xl"
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            disabled={isPending || !projectName.trim()}
            onClick={handleRename}
            className="btn-primary"
          >
            {isPending ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
