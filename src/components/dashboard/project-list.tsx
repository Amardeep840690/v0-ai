import { ProjectItem } from "./project-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetProjects } from "@/features/project/hooks/project";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import { NewProjectDialog } from "./new-project-dialog";
import { useState } from "react";

function ProjectSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card/70 border border-transparent">
      <Skeleton className="w-10 h-10 rounded-[14px]" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function ProjectList() {
  const { data: Projects, isLoading, isError } = useGetProjects();
  const [open, setOpen] = useState(false);

  if (isError) {
    return null;
  }

  return (
    <div className="flex flex-col h-full px-3">
      <div className="flex items-center justify-between px-2 py-3">
        <h3 className="text-[15px] font-semibold text-muted-foreground">
          Workspace
        </h3>
        <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
          {isLoading ? "..." : Projects?.length}
        </span>
      </div>
      <ScrollArea className="flex-1 px-1">
        <div className="space-y-2 pb-4">
          {isLoading && (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProjectSkeleton key={i} />
              ))}
            </>
          )}

          {!isLoading && (!Projects || Projects.length === 0) && (
            <Empty className="pt-6">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Folder className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>
                  Create your first project to get started
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <NewProjectDialog text={"Create your first project"} dialogOpen={open} onDialogOpenChange={setOpen} size="sm" />
                {/* <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Create your first project
                </Button> */}
              </EmptyContent>
            </Empty>
          )}

          {!isLoading &&
            Projects?.map((project) => (
              <ProjectItem
                key={project.id}
                title={project.name}
                updatedAt={project.updatedAt}
                active={false}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
