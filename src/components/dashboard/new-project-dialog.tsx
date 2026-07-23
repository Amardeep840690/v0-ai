import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateProject } from "@/features/project/hooks/project";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { AlertCircle } from "lucide-react";

export function NewProjectDialog({
  dialogOpen,
  onDialogOpenChange,
  text,
  size
}: {
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  text:string;
  size: "sm" | "default" | "lg" | "icon";
}) {
  const [projectName, setProjectName] = useState("");
  const { mutate: createProject, isPending } = useCreateProject();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    console.log("entering...");
    createProject(
      { projectName },
      {
        onSuccess: (project) => {
          router.push(`/projects/${project.id}`);
          onDialogOpenChange(false);
        },
        onError: (error) => {
          setError(error.message);
          toast.error(error.message);
        },
      },
    );
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          size={size}
          className="w-full gap-2 btn-primary transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary/30"
        >
          <Plus className="w-5 h-5" />
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border border-border bg-card shadow-floating">
        <DialogHeader>
          <DialogTitle className="text-xl">Create new project</DialogTitle>
          <DialogDescription className="text-base">
            Start a new AI-powered project or use a template.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-3">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            id="name"
            placeholder="Project name"
            className="h-12 rounded-[14px] border border-border bg-muted"
          />

          {error && (
            <div className="flex items-center gap-2 rounded-xl  bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            type="submit"
            size="default"
            className="btn-primary rounded-[14px]"
          >
            {isPending ? (
              <>
                <Spinner className="w-5 h-5" /> Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
