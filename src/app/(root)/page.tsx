import { DashboardHero } from "@/components/dashboard/hero";
import { PromptBox } from "@/components/dashboard/prompt-box";
import { PromptTemplates } from "@/components/dashboard/prompt-templates";
import { ContinueWorking } from "@/components/dashboard/continue-working";

const RootPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* <div>hello</div> */}
      <DashboardHero />
      <PromptBox />
      <PromptTemplates />
      <ContinueWorking />
      {/* Uncomment below if you want empty state instead of continue working */}
      {/* <EmptyState /> */}
    </div>
  );
};

export default RootPage;
