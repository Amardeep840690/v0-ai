import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, Paperclip, Sparkles } from "lucide-react";
import { useCreateProject } from "@/features/project/hooks/project";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptBox({ value, onChange }: PromptBoxProps) {
  const { mutate: createProject, isPending } = useCreateProject();
  const router = useRouter();

  const handleSubmit = () => {
    createProject(
      { prompt: value },
      {
        onSuccess: (project) => {
          router.push(`/projects/${project.id}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card/90 backdrop-blur-md border border-border/60 rounded-3xl p-6 md:p-8 shadow-floating transition-all duration-200 hover:scale-[1.005]">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Build an AI SaaS dashboard with Clerk authentication, PostgreSQL and Stripe..."
          className="
    h-[120px]
    max-h-[120px]
    overflow-y-auto
    resize-none
    bg-transparent
    border-none
    focus-visible:ring-0
    text-[16px]
    leading-relaxed
  "
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
            onClick={handleSubmit}
            size="lg"
            className="btn-primary gap-2 transition-all duration-200 hover:scale-[1.02]"
          >
  
            <Sparkles className="w-5 h-5" />
            {isPending ? (
              <>
                Generating
                <Spinner className="w-5 h-5" />
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
