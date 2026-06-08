import { z } from "zod";

// model for the app to use, doesnt require database.
export const BusinessSchema = z.object({
  _id: z.string().optional(),
  businessName: z.string(),
  email: z.string().email(),
  password: z.string(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(["business", "admin"]).default("business"),
});

export type Business = z.infer<typeof BusinessSchema>;
