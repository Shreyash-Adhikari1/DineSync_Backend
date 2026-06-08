import { z } from "zod";

export const RestaurantSchema = z.object({
  _id: z.string().optional(),
  ownerId: z.string().optional(),
  restaurantName: z.string(),
  restaurantDescription: z.string(),
  restaurantLogo: z.string(),

  restaurantAddress: z.string(),
  restaurantPhoneNumber: z.string(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
