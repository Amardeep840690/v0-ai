import { Template, defaultBuildLogger } from "e2b";
import { template as nextJSTemplate } from "./template";
import dotenv from "dotenv";

dotenv.config();

async function buildTemplate() {
  console.log("🚀 Building E2B template...");

  await Template.build(nextJSTemplate, {
    alias: "v0-ai-nextjs",
    cpuCount: 4,
    memoryMB: 4096,
    onBuildLogs: defaultBuildLogger(),
    apiKey: "e2b_ba85c7d42ee47d6756dcaa0f1517715cdee51f52",
  });

  console.log("✅ Template build completed!");
  console.log("Template alias: v0-ai-nextjs");
}

buildTemplate().catch((error) => {
  console.error("❌ Template build failed:", error);
  process.exit(1);
});