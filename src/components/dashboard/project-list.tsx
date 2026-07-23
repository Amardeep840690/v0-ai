
import { ProjectItem } from "./project-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Code, Image, MessageSquare, Layout, Database } from "lucide-react";

const mockProjects = [
  {
    id: "1",
    title: "AI Dashboard",
    updatedAt: "Edited 2m ago",
    active: true,
    icon: <Layout className="w-6 h-6" />,
  },
  {
    id: "2",
    title: "Resume Builder",
    updatedAt: "Edited 18m ago",
    active: false,
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: "3",
    title: "Inventory System",
    updatedAt: "Edited 1h ago",
    active: false,
    icon: <Database className="w-6 h-6" />,
  },
  {
    id: "4",
    title: "CRM SaaS",
    updatedAt: "Edited 3h ago",
    active: false,
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    id: "5",
    title: "Portfolio",
    updatedAt: "Edited yesterday",
    active: false,
    icon: <Image className="w-6 h-6" />,
  },
  {
    id: "6",
    title: "AI Chat",
    updatedAt: "Edited 2 days ago",
    active: false,
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    id: "7",
    title: "Blog Platform",
    updatedAt: "Edited 3 days ago",
    active: false,
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: "8",
    title: "Invoice App",
    updatedAt: "Edited 5 days ago",
    active: false,
    icon: <FileText className="w-6 h-6" />,
  },
];

export function ProjectList() {
  return (
    <div className="flex flex-col h-full px-3">
      <div className="flex items-center justify-between px-2 py-3">
        <h3 className="text-[15px] font-semibold text-muted-foreground">Workspace</h3>
        <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
          {mockProjects.length}
        </span>
      </div>
      <ScrollArea className="flex-1 px-1">
        <div className="space-y-2 pb-4">
          {mockProjects.map((project) => (
            <ProjectItem
              key={project.id}
              title={project.title}
              updatedAt={project.updatedAt}
              active={project.active}
              icon={project.icon}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
