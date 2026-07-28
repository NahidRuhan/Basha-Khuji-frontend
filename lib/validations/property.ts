import * as z from "zod";

export const createPropertySchema = z.object({
  propertyName: z.string().min(5, "Property name must be at least 5 characters."),
  categoryId: z.string().min(1, "Please select a category."),
  locationName: z.string().min(2, "Please enter a location."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  amenities: z.array(z.string()).min(1, "Please select at least one amenity."),
  vacantFrom: z.date({
    message: "Please select a date.",
  }),
  images: z.array(z.string().url()).min(1, "Please upload at least one image."),
  bedroomCount: z.coerce.number().min(1, "Must have at least 1 bedroom."),
  squarefoot: z.coerce.number().min(100, "Square footage must be at least 100."),
});

export type CreatePropertyValues = z.infer<typeof createPropertySchema>;

// Partial schema for updates
export const updatePropertySchema = createPropertySchema.partial();

export type UpdatePropertyValues = z.infer<typeof updatePropertySchema>;
