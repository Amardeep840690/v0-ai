"use client";

import { useState } from "react";

import { DashboardHero } from "@/components/dashboard/hero";
import { PromptBox } from "@/components/dashboard/prompt-box";
import { PromptTemplates } from "@/components/dashboard/prompt-templates";
import { ContinueWorking } from "@/components/dashboard/continue-working";

const RootPage = () => {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="max-w-4xl mx-auto">
      <DashboardHero />

      <PromptBox value={prompt} onChange={setPrompt} />

      <PromptTemplates onSelectPrompt={setPrompt}/>

      <ContinueWorking />
    </div>
  );
};

export default RootPage;
