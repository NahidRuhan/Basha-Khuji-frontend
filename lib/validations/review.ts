import * as z from "zod";

export const reviewSchema = z.object({
  requestId: z.string().min(1, "Request ID is required."),
  review: z.string().min(10, "Review must be at least 10 characters long."),
  rating: z.coerce.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
});

export type ReviewValues = z.infer<typeof reviewSchema>;
