import { Router } from "express";
import { TableController } from "../controller/table.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

const tableRouter = Router();
const tableController = new TableController();

//   Create table for a restaurant

tableRouter.post(
  "/restaurant/:restaurantId",
  authMiddleware,
  tableController.createTable,
);

//   Get all tables for a restaurant

tableRouter.get(
  "/restaurant/:restaurantId",
  authMiddleware,
  tableController.getRestaurantTables,
);

//  Update table

tableRouter.patch("/:tableId", authMiddleware, tableController.updateTable);

//  Delete table

tableRouter.delete("/:tableId", authMiddleware, tableController.deleteTable);

// Toggle active status

tableRouter.patch(
  "/:tableId/toggle-active",
  authMiddleware,
  tableController.toggleTableActive,
);

export default tableRouter;
