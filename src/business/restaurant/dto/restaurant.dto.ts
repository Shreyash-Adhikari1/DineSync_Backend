import { z } from "zod";
import { RestaurantSchema } from "../type/restaurant.type";

export const CreateRestaurantDTO = RestaurantSchema.pick({
  restaurantName: true,
  restaurantDescription: true,
  restaurantAddress: true,
  restaurantPhoneNumber: true,
});

export type CreateRestaurantDTO = z.infer<typeof CreateRestaurantDTO>;

export const EditRestaurantDTO = RestaurantSchema.pick({
  restaurantName: true,
  restaurantDescription: true,
  restaurantLogo: true,
  restaurantAddress: true,
  restaurantPhoneNumber: true,
}).partial();

export type EditRestaurantDTO = z.infer<typeof EditRestaurantDTO>;
