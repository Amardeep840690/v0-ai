import onboardUser from "@/features/auth/action";
import { DashboardBackground } from "@/components/background/dashboard-background";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/navbar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await onboardUser();

  return <>{children}</>;
}
