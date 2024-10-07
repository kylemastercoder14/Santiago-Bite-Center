"use server";

import db from "@/lib/db";
import { InventoryFormSchema } from "@/lib/validators";
import { z } from "zod";

export const createInventory = async (
  values: z.infer<typeof InventoryFormSchema>
) => {
  const validatedField = InventoryFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, stocks, buffer } = validatedField.data;

  try {
    const inventory = await db.inventory.create({
      data: {
        name,
        stocks,
        buffer,
      },
    });

    return {
      success: "Vaccine added successfully",
      inventoryId: inventory.id,
    };
  } catch (error: any) {
    return {
      error: `Failed to add vaccine. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateInventory = async (
  values: z.infer<typeof InventoryFormSchema>,
  inventoryId: string
) => {
  const validatedField = InventoryFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, stocks, buffer, consume } = validatedField.data;

  try {
    const inventory = await db.inventory.update({
      where: {
        id: inventoryId,
      },
      data: {
        name,
        stocks,
        buffer,
        consumed: consume,
      },
    });

    return {
      success: "Vaccine updated successfully",
      inventoryId: inventory.id,
    };
  } catch (error: any) {
    return {
      error: `Failed to update vaccine. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteInventory = async (inventoryId: string) => {
  if (!inventoryId) {
    return { error: "Inventory ID is required" };
  }

  try {
    await db.inventory.delete({
      where: {
        id: inventoryId,
      },
    });

    return { success: "Vaccine deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete vaccine. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
