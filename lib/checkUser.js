
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("No email address found for the signed-in Clerk user.");
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    email.split("@")[0];

  const username =
    user.username || `${name.trim().replace(/\s+/g, "-")}-${user.id.slice(-4)}`;

  const loggedInUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (loggedInUser) {
    return loggedInUser;
  }

  const client = await clerkClient();

  if (!user.username) {
    await client.users.updateUser(user.id, { username });
  }

  return await db.user.create({
    data: {
      clerkUserId: user.id,
      name,
      imageUrl: user.imageUrl,
      email,
      username,
    },
  });
};
