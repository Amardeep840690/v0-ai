import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center py-12 mt-8 border border-dashed border-border rounded-2xl bg-card/50 backdrop-blur-sm">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Start your first project</h3>
      <p className="text-muted-foreground text-sm">
        Describe your idea above or create an empty project from the sidebar.
      </p>
    </div>
  );
}
