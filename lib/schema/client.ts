import z from "zod";

import { isValidPhoneNumber } from "react-phone-number-input";

export const clientSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(1, "Must be at least 1 character")
    .max(30, "Cannot exceed 30 characters"),
  company: z.string().max(50, "Company name too long").optional(),
  phone: z
    .string()
    .refine(isValidPhoneNumber, "Invalid phone number")
    .optional()
    .or(z.literal("")),
});
export type clientSchemaType = z.infer<typeof clientSchema>;
