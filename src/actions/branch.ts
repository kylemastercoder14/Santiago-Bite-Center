"use server";

import db from "@/lib/db";
import { BranchFormSchema } from "@/lib/validators";
import { z } from "zod";

export const createBranch = async (
  values: z.infer<typeof BranchFormSchema>
) => {
  const validatedField = BranchFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, contact, address } = validatedField.data;

  try {
    const branch = await db.branch.create({
      data: {
        name,
        contact,
        address,
      },
    });

    return { success: "Branch created successfully", branchId: branch.id };
  } catch (error: any) {
    return {
      error: `Failed to create branch. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateBranch = async (
  values: z.infer<typeof BranchFormSchema>,
  branchId: string
) => {
  const validatedField = BranchFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, contact, address } = validatedField.data;

  try {
    const branch = await db.branch.update({
      where: {
        id: branchId,
      },
      data: {
        name,
        contact,
        address,
      },
    });

    return { success: "Branch updated successfully", branchId: branch.id };
  } catch (error: any) {
    return {
      error: `Failed to update branch. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteBranch = async (branchId: string) => {
  if (!branchId) {
    return { error: "Branch ID is required" };
  }

  try {
    await db.branch.delete({
      where: {
        id: branchId,
      },
    });

    return { success: "Branch deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete branch. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const getAllBranches = async () => {
  return await db.branch.findMany();
};
