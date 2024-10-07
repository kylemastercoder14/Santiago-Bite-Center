import db from "@/lib/db";

export const getUserById = async (id: string) => {
  const response = await db.user.findUnique({
    where: {
      clerkId: id,
    },
  });

  return response;
};
