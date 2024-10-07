"use server";

import db from "@/lib/db";
import { ServiceFormSchema } from "@/lib/validators";
import { z } from "zod";

export const createService = async (
  values: z.infer<typeof ServiceFormSchema>
) => {
  const validatedField = ServiceFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, price, description } = validatedField.data;

  try {
    const service = await db.service.create({
      data: {
        name,
        description,
        price,
      },
    });

    return { success: "Service created successfully", serviceId: service.id };
  } catch (error: any) {
    return {
      error: `Failed to create service. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateService = async (
  values: z.infer<typeof ServiceFormSchema>,
  serviceId: string
) => {
  const validatedField = ServiceFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, price, description } = validatedField.data;

  try {
    const service = await db.service.update({
      where: {
        id: serviceId,
      },
      data: {
        name,
        price,
        description,
      },
    });

    return { success: "Service updated successfully", serviceId: service.id };
  } catch (error: any) {
    return {
      error: `Failed to update service. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteService = async (serviceId: string) => {
  if (!serviceId) {
    return { error: "Service ID is required" };
  }

  try {
    await db.service.delete({
      where: {
        id: serviceId,
      },
    });

    return { success: "Service deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete service. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const getAllServices = async () => {
  const services = await db.service.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return services;
};
