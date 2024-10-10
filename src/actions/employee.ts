"use server";

import db from "@/lib/db";
import { EmployeeFormSchema } from "@/lib/validators";
import { z } from "zod";

export const createEmployee = async (
  values: z.infer<typeof EmployeeFormSchema>
) => {
  const validatedField = EmployeeFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { firstName, lastName, email, branch, role, imageUrl } =
    validatedField.data;

  try {
    const employee = await db.employee.create({
      data: {
        firstName,
        lastName,
        email,
        branchId: branch,
        role,
        imageUrl,
      },
    });

    return {
      success: "Employee created successfully",
      employeeId: employee.id,
    };
  } catch (error: any) {
    return {
      error: `Failed to create employee. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateEmployee = async (
  values: z.infer<typeof EmployeeFormSchema>,
  employeeId: string
) => {
  const validatedField = EmployeeFormSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { firstName, lastName, email, branch, role, imageUrl } =
    validatedField.data;

  try {
    const employee = await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        firstName,
        lastName,
        email,
        branchId: branch,
        role,
        imageUrl,
      },
    });

    return {
      success: "Employee updated successfully",
      employeeId: employee.id,
    };
  } catch (error: any) {
    return {
      error: `Failed to update employee. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteEmployee = async (employeeId: string) => {
  if (!employeeId) {
    return { error: "Employee ID is required" };
  }

  try {
    await db.employee.delete({
      where: {
        id: employeeId,
      },
    });

    return { success: "Employee deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete employee. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const getAllEmployees = async () => {
  const staff = await db.employee.findMany({
    orderBy: {
      firstName: "asc",
    },
  });

  return staff;
};
