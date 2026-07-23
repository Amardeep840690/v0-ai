import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DashboardHero() {
  return (
    <div className="text-center py-10 md:py-12">
      <Badge 
        variant="outline" 
        className="mb-6 px-4 py-2 text-sm gap-2 bg-background/60 backdrop-blur-sm border-border rounded-full"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        AI-first code generation workspace
      </Badge>
      <h1 className="text-[44px] md:text-[56px] font-bold tracking-tight leading-[1.05] mb-4">
        <span className="block">What do you want</span>
        <span className="block font-serif italic text-primary mt-1 text-[40px] md:text-[50px]">to build today?</span>
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-[18px] leading-[1.6]">
        Describe your idea and V0-AI will generate a complete application.
      </p>
    </div>
  );
}
