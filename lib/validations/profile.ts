import * as z from "zod";

export const profileUpdateSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters.").optional(),
  profileImage: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
