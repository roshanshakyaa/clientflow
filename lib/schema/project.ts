import z from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  clientId: z.string().min(1, "Please select a client"),
  deadline: z.string().min(1, "Deadline is required"),
  description: z.string().optional(),
  budget: z.number().min(0).optional(),
});

export type projectSchemaType = z.infer<typeof projectSchema>;
