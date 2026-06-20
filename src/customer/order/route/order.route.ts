import { Router } from "express";
import { OrderController } from "../controller/order.controller";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post("/:sessionId/add-item", orderController.addItemToOrder);

orderRouter.delete(
  "/:orderId/item/:menuItemId",
  orderController.removeItemFromOrder,
);

orderRouter.delete("/:orderId", orderController.cancelOrder);

orderRouter.patch("/:orderId/start-cooking", orderController.startCooking);

orderRouter.patch("/:orderId/mark-cooked", orderController.markCooked);

orderRouter.patch("/:orderId/mark-served", orderController.markServed);
orderRouter.get("/session/:sessionId", orderController.getOrdersBySession);

orderRouter.get(
  "/session/:sessionId/member/:memberId",
  orderController.getOrdersByMember,
);

export default orderRouter;
