import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectItemProps {
  title: string;
  updatedAt: string;
  active?: boolean;
  icon?: React.ReactNode;
}

export function ProjectItem({ title, updatedAt, active, icon }: ProjectItemProps) {
  return (
    <div className={cn(
      "group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 hover:scale-[1.01] bg-card/70 backdrop-blur-sm border border-transparent hover:border-border/60 shadow-soft",
      active && "bg-accent/60 border-primary/40"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
          active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"
        )}>
          {icon || <Folder className="w-5 h-5" />}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-[16px]">{title}</span>
          <span className="text-[13px] text-muted-foreground">{updatedAt}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
