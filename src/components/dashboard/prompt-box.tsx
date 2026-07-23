
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, Paperclip, Sparkles } from "lucide-react";

export function PromptBox() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card/90 backdrop-blur-md border border-border/60 rounded-3xl p-6 md:p-8 shadow-floating transition-all duration-200 hover:scale-[1.005]">
        <Textarea
          placeholder="Build an AI SaaS dashboard with Clerk authentication, PostgreSQL and Stripe..."
          className="min-h-[120px] bg-transparent border-none resize-none focus-visible:ring-0 text-[16px] leading-relaxed"
        />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 hover:bg-muted rounded-[14px] transition-all duration-200 hover:scale-[1.02] text-muted-foreground"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">Attach Image</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 hover:bg-muted rounded-[14px] transition-all duration-200 hover:scale-[1.02] text-muted-foreground"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">Attach File</span>
            </Button>
          </div>
          <Button 
            size="lg"
            className="btn-primary gap-2 transition-all duration-200 hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5" />
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
