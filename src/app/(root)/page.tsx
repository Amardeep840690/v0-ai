"use client";

import { useState } from "react";

import { DashboardBackground } from "@/components/background/dashboard-background";
import { DashboardHero } from "@/components/dashboard/hero";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { PromptBox } from "@/components/dashboard/prompt-box";
import { PromptTemplates } from "@/components/dashboard/prompt-templates";
import { ContinueWorking } from "@/components/dashboard/continue-working";

const RootPage = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="relative h-screen flex overflow-hidden">
      {/* Background */}
      <DashboardBackground />

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main dashboard */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <DashboardHero />

            <PromptBox value={prompt} onChange={setPrompt} />

            <PromptTemplates onSelectPrompt={setPrompt} />

            <ContinueWorking />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RootPage;
