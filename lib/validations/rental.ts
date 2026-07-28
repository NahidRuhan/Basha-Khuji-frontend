import * as z from "zod";

export const rentalRequestSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required."),
  message: z.string().min(10, "Please provide a brief message to the landlord (min 10 characters)."),
});

export type RentalRequestValues = z.infer<typeof rentalRequestSchema>;
