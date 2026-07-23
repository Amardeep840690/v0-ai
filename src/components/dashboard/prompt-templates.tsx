import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  ShoppingCart,
} from "lucide-react";

export const templates = [
  {
    label: "Landing Page",
    icon: Globe,
    prompt:
      "Build a modern responsive SaaS landing page with a hero section, feature showcase, pricing cards, testimonials, FAQ, contact section, smooth animations, and dark mode.",
  },
  {
    label: "SaaS Dashboard",
    icon: Layout,
    prompt:
      "Create a premium SaaS dashboard with a collapsible sidebar, analytics cards, charts, recent activity table, notifications, user profile menu, and responsive design.",
  },
  {
    label: "Portfolio",
    icon: User,
    prompt:
      "Design a modern developer portfolio with a hero section, about, skills, featured projects, experience timeline, blog section, and contact form with smooth animations.",
  },
  {
    label: "CRM",
    icon: BarChart3,
    prompt:
      "Build a CRM dashboard for managing customers with customer lists, pipelines, analytics, task management, search, filters, and responsive tables.",
  },
  {
    label: "AI Chat",
    icon: MessageSquare,
    prompt:
      "Create a ChatGPT-style AI chat interface with conversation history, streaming messages, markdown rendering, code blocks, file upload, and dark mode.",
  },
  {
    label: "Blog",
    icon: FileText,
    prompt:
      "Build a modern blogging platform with featured articles, categories, search, markdown support, author pages, reading progress, and responsive layout.",
  },
  {
    label: "Invoice App",
    icon: Receipt,
    prompt:
      "Create an invoice management application with invoice creation, PDF preview, payment status, customer management, analytics, and dashboard overview.",
  },
  {
    label: "Documentation",
    icon: BookOpen,
    prompt:
      "Build a beautiful documentation website with sidebar navigation, searchable docs, code highlighting, table of contents, dark mode, and responsive design.",
  },
  {
    label: "Admin Panel",
    icon: Shield,
    prompt:
      "Design a modern admin panel with user management, roles and permissions, analytics dashboard, settings pages, audit logs, and responsive tables.",
  },
  {
    label: "Ecommerce",
    icon: ShoppingCart,
    prompt:
      "Create a modern ecommerce storefront with product listings, categories, filters, shopping cart, wishlist, checkout flow, and responsive product pages.",
  },
];

interface PromptTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptTemplates({ onSelectPrompt }: PromptTemplatesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      {templates.map((template) => {
        const Icon = template.icon;
        return (
          <Button
            key={template.label}
            onClick={() => onSelectPrompt(template.prompt)}
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
