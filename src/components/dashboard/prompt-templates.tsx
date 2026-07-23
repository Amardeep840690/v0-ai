import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Layout, 
  User, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Receipt, 
  BookOpen, 
  Shield, 
  ShoppingCart 
} from "lucide-react";

const templates = [
  { label: "Landing Page", icon: Globe },
  { label: "SaaS Dashboard", icon: Layout },
  { label: "Portfolio", icon: User },
  { label: "CRM", icon: BarChart3 },
  { label: "AI Chat", icon: MessageSquare },
  { label: "Blog", icon: FileText },
  { label: "Invoice App", icon: Receipt },
  { label: "Admin Panel", icon: Shield },
  { label: "Documentation", icon: BookOpen },
  { label: "Ecommerce", icon: ShoppingCart },
];

export function PromptTemplates() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      {templates.map((template) => {
        const Icon = template.icon;
        return (
          <Button
            key={template.label}
            variant="ghost"
            className="h-9 rounded-full gap-2 transition-all duration-200 hover:scale-[1.02] px-4 py-2 text-[14px] shadow-soft bg-card border border-border hover:border-primary/30 hover:bg-muted"
          >
            <Icon className="w-4 h-4" />
            {template.label}
          </Button>
        );
      })}
    </div>
  );
}
