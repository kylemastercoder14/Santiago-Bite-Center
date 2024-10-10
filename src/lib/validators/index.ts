import { z } from "zod";

export const UserSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required." })
    .or(z.literal(""))
    .optional(),
  lastName: z
    .string()
    .min(1, { message: "Last name is required." })
    .or(z.literal(""))
    .optional(),
});

export type State = {
  success: any;
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

export const DATE_YEAR_MIN = 1970;
export const DATE_DEFAULT_FORMAT = "yyyy-MM-dd"; // 2022-08-11
export const DATETIME_DEFAULT_FORMAT = "yyyy-MM-dd h:mm a"; // 2022-08-11 1:00 PM
export const DATE_DISPLAY_FORMAT = "dd/MM/yyyy";

export const BranchFormSchema = z.object({
  name: z.string().min(1, { message: "Branch name is required." }),
  contact: z.string().min(1, { message: "Branch contact is required." }),
  address: z.string().min(1, { message: "Branch address is required." }),
});

export const ServiceFormSchema = z.object({
  name: z.string().min(1, { message: "Service name is required." }),
  description: z
    .string()
    .min(1, { message: "Service description is required." }),
  price: z.coerce.number().min(1, { message: "Service price is required." }),
});

export const EmployeeFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().min(1, { message: "Email address is required." }),
  imageUrl: z.string().optional(),
  role: z.string().min(1, { message: "Role is required." }),
  branch: z.string().min(1, { message: "Branch is required." }),
});

export const InventoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  stocks: z.coerce.number().min(1, { message: "Stocks is required." }),
  buffer: z.coerce.number().min(1, { message: "Buffer is required." }),
  consume: z.coerce.number().optional(),
});

export const AppointmentFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  forInsurance: z.string().optional(),
  forAics: z.string().optional(),
  userCategory: z.string().min(1, { message: "User category is required." }),
});
