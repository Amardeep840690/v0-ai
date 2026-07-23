import onboardUser from "@/features/auth/action";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/navbar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await onboardUser();
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
