import { users } from "@/db/schema";
import { db } from "@/index";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function onboardUser() {
  const { userId } = await auth();

  if (!userId) return;

  const clerkUser = await currentUser();

  if (!clerkUser) return;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null;

  const name =
    clerkUser.fullName ??
    ([clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      null);

  await db
    .insert(users)
    .values({
      clerkId: userId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      name,
      imageUrl: clerkUser.imageUrl,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        name,
        imageUrl: clerkUser.imageUrl,
      },
    });
}
