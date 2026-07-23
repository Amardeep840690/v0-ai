import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function DashboardNavbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-12 pr-5 h-12 bg-card/80 border border-border rounded-[14px] shadow-soft"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="rounded-[14px] relative transition-all duration-200 hover:scale-[1.02] hover:bg-muted">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>
        <UserButton />
      </div>
    </nav>
  );
}
