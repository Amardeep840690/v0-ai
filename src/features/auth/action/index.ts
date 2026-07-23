import { users } from "@/db/schema";
import { db } from "@/index";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

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

export async function getCurrentUser() {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }
    const [userData] = await db
      .select({
        id: users.id,
        fullName: users.name,
        email: users.email,
        imageUrl: users.imageUrl,
        clerkId: users.clerkId,
      })
      .from(users)
      .where(eq(users.clerkId, user.id));
    return userData;
  } catch (error) {
    console.error("❌ Error fetching current user:", error);
    return null;
  }
}
