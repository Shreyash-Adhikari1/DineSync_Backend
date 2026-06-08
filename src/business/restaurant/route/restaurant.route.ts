import { Router } from "express";
import { RestaurantController } from "../controller/restaurant.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

const restaurantRouter = Router();

const restaurantController = new RestaurantController();

restaurantRouter.post(
  "/create",
  authMiddleware,
  restaurantController.createRestaurant,
);

restaurantRouter.patch(
  "/edit/:restaurantId",
  authMiddleware,
  restaurantController.updateRestaurant,
);

restaurantRouter.delete(
  "/delete/:restaurantId",
  authMiddleware,
  restaurantController.deleteRestaurant,
);

restaurantRouter.get(
  "/own-restaurants",
  authMiddleware,
  restaurantController.getRestaurantsByBusiness,
);

export default restaurantRouter;
