"use client";
// import { Logo } from "@/components/brand/logo";
import { ProjectList } from "./project-list";
import { NewProjectDialog } from "./new-project-dialog";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, Menu, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import BrandLogo from "../brand/brand_logo.png";
import { useState } from "react";

export function DashboardSidebar() {
  const isMobile = useIsMobile();
  const [open ,setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-1">
          {/* <Logo size="lg" /> */}
          <Image
            src={BrandLogo}
            alt="V0-AI Logo"
            width={40}
            height={40}
            priority
          />
          <div>
            <h2 className="text-xl font-bold">V0-AI</h2>
            <p className="text-xs text-muted-foreground">Build with AI</p>
          </div>
        </div>
        <div className="mt-5">
          
          <NewProjectDialog dialogOpen={open} onDialogOpenChange={setOpen} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ProjectList />
      </div>
      <div className="p-6 space-y-2">
        <Separator className="my-2" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-[14px] transition-all duration-200 hover:scale-[1.01] hover:bg-muted px-4 py-3"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-[14px] transition-all duration-200 hover:scale-[1.01] hover:bg-muted px-4 py-3"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm">Help & Documentation</span>
        </Button>
        <div className="flex items-center justify-between pt-2 px-1">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Theme</span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="p-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Image
            src={BrandLogo}
            alt="V0-AI Logo"
            width={40}
            height={40}
            priority
          />
          <h2 className="font-bold">V0-AI</h2>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-[300px] border-r border-border bg-background"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <aside className="w-[300px] border-r border-border h-full hidden md:flex flex-col bg-background/70 backdrop-blur-md">
      <SidebarContent />
    </aside>
  );
}
