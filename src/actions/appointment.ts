"use server";

import db from "@/lib/db";

type CreateAppointmentResponse =
  | { error: string }
  | {
      id: string;
      date: string;
      time: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
    };

export const createAppointment = async (
  userId: string,
  date: string,
  time: string
): Promise<CreateAppointmentResponse> => {
  if (!userId) return { error: "User not found" };
  if (!date) return { error: "Date is required" };
  if (!time) return { error: "Time is required" };

  try {
    const appointment = await db.appointment.create({
      data: {
        date,
        time,
        userId,
      },
    });
    return appointment;
  } catch (error: any) {
    console.error("Database error:", error.message, error.code, error.meta);
    return { error: "Failed to create appointment." };
  }
};
