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

export const createBillingAppointment = async (
  values: z.infer<typeof AppointmentFormSchema>,
  selectedServices: any[],
  appointmentId: string,
  selectedVaccinationData: { id: string; quantity: number }[],
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
    await db.appointment.update({
      data: {
        status: "On Going",
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

    await Promise.all(
      selectedServices.map((service) => {
        const serviceId = service.service.id;

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

    await Promise.all(
      selectedVaccinationData.map((vaccination) => {
        const vaccinationId = vaccination.id;

        if (!vaccinationId) {
          throw new Error(
            `Invalid vaccinationId for billing item: ${vaccination}`
          );
        }

        // Create the vaccination record for the patient
        return db.vaccination.create({
          data: {
            inventory: {
              connect: { id: vaccinationId },
            },
            quantity: vaccination.quantity,
            user: {
              connect: { id: userId },
            },
          },
        });
      })
    );

    // Deduct stocks or buffer from inventory for selected vaccinations
    await Promise.all(
      selectedVaccinationData.map(async (vaccination) => {
        const vaccinationId = vaccination.id;
        const quantityUsed = vaccination.quantity;

        // Fetch the current stock for the vaccination item
        const inventory = await db.inventory.findUnique({
          where: { id: vaccinationId },
          select: { stocks: true, buffer: true },
        });

        if (!inventory) {
          throw new Error(
            `Inventory not found for vaccinationId: ${vaccinationId}`
          );
        }

        // If stocks are greater than 0, decrement from stocks
        if (inventory.stocks > 0) {
          await db.inventory.update({
            where: { id: vaccinationId },
            data: {
              stocks: {
                decrement: Math.min(inventory.stocks, quantityUsed), // Deduct the quantity or max available stocks
              },
              consumed: {
                increment: Math.min(inventory.stocks, quantityUsed),
              }
            },
          });

          // If the quantity used exceeds current stock, also decrement from buffer
          if (quantityUsed > inventory.stocks) {
            await db.inventory.update({
              where: { id: vaccinationId },
              data: {
                buffer: {
                  decrement: quantityUsed - inventory.stocks, // Deduct the remainder from buffer
                },
                consumed: {
                  increment: Math.min(inventory.stocks, quantityUsed),
                }
              },
            });
          }
        } else {
          // If stocks are 0, decrement from buffer directly
          await db.inventory.update({
            where: { id: vaccinationId },
            data: {
              buffer: {
                decrement: quantityUsed,
              },
              consumed: {
                increment: Math.min(inventory.stocks, quantityUsed),
              }
            },
          });
        }
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
