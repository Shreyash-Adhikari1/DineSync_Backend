import z from "zod";
import { MenuItemSchema } from "../types/menu.type";

export const CreateMenuItemDTO = MenuItemSchema.pick({
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  commonAllergens: true,
}).partial();
export type CreateMenuItemDTO = z.infer<typeof CreateMenuItemDTO>;

export const EditMenuItemDTO = MenuItemSchema.pick({
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  commonAllergens: true,
}).partial();
export type EditMenuItemDTO = z.infer<typeof EditMenuItemDTO>;
