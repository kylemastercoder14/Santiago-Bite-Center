"use server";

import db from "@/lib/db";
import { AppointmentFormSchema } from "@/lib/validators";
import { Service } from "@prisma/client";
import { z } from "zod";

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
  time: string,
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

export const createBillingAppointment = async (
  values: z.infer<typeof AppointmentFormSchema>,
  selectedServices: any[],
  appointmentId: string,
  userId: string
) => {
  const validatedField = AppointmentFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { forInsurance, forAics, userCategory } = validatedField.data;

  const dateNow = new Date();
  const timeNow = dateNow.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const appointment = await db.appointment.update({
      data: {
        status: "Completed",
        userId: userId,
      },
      where: {
        id: appointmentId,
      },
    });

    const billing = await db.billing.create({
      data: {
        date: dateNow.toISOString(),
        time: timeNow,
        forInsurance: forInsurance === "true",
        forAics: forAics === "true",
        userCategory,
        userId,
      },
    });

    const billingItems = await Promise.all(
      selectedServices.map((service) => {
        const serviceId = service.service.id; // Extract service id

        if (!serviceId) {
          throw new Error(`Invalid serviceId for billing item: ${service}`);
        }

        return db.billingItem.create({
          data: {
            service: {
              connect: { id: serviceId },
            },
            billing: {
              connect: { id: billing.id },
            },
          },
        });
      })
    );

    return {
      success: "Billing and appointment updated successfully",
    };
  } catch (error: any) {
    return {
      error: `Failed to update appointment and billing. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
