"use server";
import db from "@/lib/db";

export const createUser = async (
  email: string,
  familyName: string,
  givenName: string,
  password: string,
  clerkId: string
) => {
  if (!email || !familyName || !givenName || !password) {
    return { error: "All fields are required." };
  }

  await db.user.create({
    data: {
      email,
      firstName: givenName,
      lastName: familyName,
      password,
      clerkId,
    },
  });
  return { success: "User created successfully." };
};

export const createWalkInPatient = async (
  email: string,
  familyName: string,
  givenName: string,
) => {
  if (!email || !familyName || !givenName) {
    return { error: "All fields are required." };
  }

  const data = await db.user.create({
    data: {
      email,
      firstName: givenName,
      lastName: familyName,
    },
  });
  return { success: "User created successfully.", userId: data.id };
};