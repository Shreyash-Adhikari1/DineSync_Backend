import { z } from "zod";
import { BusinessSchema } from "../types/business.type";

// The DTO [Data transfer Object] defines what values are needed for certain operations
// For registration the following are necessary
export const RegisterBusinessDTO = BusinessSchema.pick({
  businessName: true,
  email: true,
  password: true,
  address: true,
  phoneNumber: true,
}).extend({
  password: z.string().min(8, "Passwords must be at least 8 characters "),
}); // ensures paswords are atleast 8 chars long
export type RegisterBusinessDTO = z.infer<typeof RegisterBusinessDTO>;

export const LoginBusinessDTO = BusinessSchema.pick({
  email: true,
  password: true,
});
export type LoginBusinessDTO = z.infer<typeof LoginBusinessDTO>;

export const EditBusinessDTO = BusinessSchema.pick({
  businessName: true,
  email: true,
  role: true,
}).partial(); // doesnt ask user to insert all field when editing
export type EditBusinessDTO = z.infer<typeof EditBusinessDTO>;
