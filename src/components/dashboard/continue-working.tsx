import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Activity, Layout, ExternalLink } from "lucide-react";

export function ContinueWorking() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <div>
          <h3 className="font-semibold text-base">Continue Working</h3>
          <p className="text-xs text-muted-foreground">Pick up where you left off</p>
        </div>
      </div>
      <Card className="shadow-floating transition-all duration-200 hover:scale-[1.01] border border-border rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
              <Layout className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[18px]">AI Dashboard</h4>
              <div className="flex items-center gap-5 mt-2">
                <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>12 Messages</span>
                </div>
                <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>26 Files</span>
                </div>
                <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>Last edited 2 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-0 pb-6 px-6">
          <Button 
            size="sm"
            className="ml-auto gap-2 btn-champagne transition-all duration-200 hover:scale-[1.02] h-11"
          >
            Open Project
            <ExternalLink className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
