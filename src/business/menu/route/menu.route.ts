import { Router } from "express";
import { MenuController } from "../controller/menu.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { uploads } from "../../../middleware/upload.middleware";

const menuRouter = Router();
const menuController = new MenuController();

menuRouter.post(
  "/restaurant/:restaurantId",
  authMiddleware,
  uploads.single("menu-item"),
  menuController.createMenuItem,
);

menuRouter.patch(
  "/restaurant/:restaurantId/:menuItemId",
  authMiddleware,
  uploads.single("menu-item"),
  menuController.updateMenuItem,
);

menuRouter.get(
  "/restaurant/:restaurantId",
  authMiddleware,
  menuController.getMenuByRestaurant,
);

menuRouter.get(
  "/restaurant/:restaurantId/available",
  authMiddleware,
  menuController.getAvailableMenu,
);

menuRouter.get(
  "/restaurant/:restaurantId/category/:category",
  authMiddleware,
  menuController.getMenuByCategory,
);

menuRouter.delete(
  "/restaurant/:restaurantId/:menuItemId",
  authMiddleware,
  menuController.deleteMenuItem,
);

menuRouter.delete(
  "/restaurant/:restaurantId",
  authMiddleware,
  menuController.deleteMenuyRestaurant,
);

menuRouter.patch(
  "/restaurant/:restaurantId/:menuItemId/popularity",
  authMiddleware,
  menuController.toggleItemPopularity,
);

menuRouter.patch(
  "/restaurant/:restaurantId/:menuItemId/availability",
  authMiddleware,
  menuController.toggleMenuItemAvailability,
);

export default menuRouter;
