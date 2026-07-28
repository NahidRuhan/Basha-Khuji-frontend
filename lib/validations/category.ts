import * as z from "zod";

export const categorySchema = z.object({
  categoryName: z.string().min(2, "Category name must be at least 2 characters."),
});

export type CategoryValues = z.infer<typeof categorySchema>;
