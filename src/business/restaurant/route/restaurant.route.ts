import { Router } from "express";
import { RestaurantController } from "../controller/restaurant.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

const restaurantRouter = Router();
const restaurantController = new RestaurantController();

/**
 * Create restaurant
 */
restaurantRouter.post(
  "/",
  authMiddleware,
  restaurantController.createRestaurant,
);

/**
 * Update restaurant
 */
restaurantRouter.patch(
  "/:restaurantId",
  authMiddleware,
  restaurantController.updateRestaurant,
);

/**
 * Delete restaurant
 */
restaurantRouter.delete(
  "/:restaurantId",
  authMiddleware,
  restaurantController.deleteRestaurant,
);

/**
 * Get all restaurants owned by business
 */
restaurantRouter.get(
  "/own",
  authMiddleware,
  restaurantController.getRestaurantsByBusiness,
);

export default restaurantRouter;
