import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  await auth.protect();
  const user = await auth();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <UserButton />
      <ModeToggle />
      <h1>hello vo-ai</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
