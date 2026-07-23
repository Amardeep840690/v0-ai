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

interface ProjectItemProps {
  title: string;
  updatedAt: Date | string;
  active: boolean;
}

export function ProjectItem({
  title,
  updatedAt,
  active,
}: ProjectItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-card/80 hover:shadow-soft",
        active && "bg-accent/60"
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
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}