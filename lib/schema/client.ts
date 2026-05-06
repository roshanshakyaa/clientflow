import z from "zod";

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
  phone: z.string().max(20, "Phone number too long").optional(),
});

export type clientSchemaType = z.infer<typeof clientSchema>;
