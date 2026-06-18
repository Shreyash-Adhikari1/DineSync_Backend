import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { SessionController } from "../controller/session.controller";

const sessionRouter = Router();

const sessionController = new SessionController();

/*
Customer Routes
*/

sessionRouter.post("/join/:qrToken", sessionController.joinTable);

sessionRouter.get("/:sessionId", sessionController.getSession);

sessionRouter.get(
  "/table/:tableId/active",
  sessionController.getActiveSessionByTable,
);

/*
Business Routes
*/

sessionRouter.patch(
  "/:sessionId/close",
  authMiddleware,
  sessionController.closeSession,
);

sessionRouter.get(
  "/restaurant/:restaurantId",
  authMiddleware,
  sessionController.getRestaurantSessions,
);

export default sessionRouter;
