
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
import { Plus } from "lucide-react";

export function NewProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full gap-2 btn-primary transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary/30">
          <Plus className="w-5 h-5" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border border-border bg-card shadow-floating">
        <DialogHeader>
          <DialogTitle className="text-xl">Create new project</DialogTitle>
          <DialogDescription className="text-base">
            Start a new AI-powered project or use a template.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input id="name" placeholder="Project name" className="rounded-[14px] bg-muted border border-border h-12" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" size="default" className="btn-primary rounded-[14px]">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
