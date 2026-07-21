import onboardUser from "@/features/auth/action";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await onboardUser();
  
  return children;
}
