import z from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  clientId: z.string().min(1, "Client is required"),
  description: z.string().optional(),
  status: z.enum(["proposal", "active", "on-hold", "completed", "archived"]),
  priority: z.enum(["low", "medium", "high"]),
  startDate: z.string().min(1, "Start date is required"), // Keep as string for the input
  deadline: z.string().min(1, "Deadline is required"),
  budget: z.number().min(0, "Budget cannot be negative").optional(),
  hourlyRate: z.number().min(0, "Rate cannot be negative").optional(),
});
export type projectSchemaType = z.infer<typeof projectSchema>;
