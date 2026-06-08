import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { uploads } from "../../../middleware/upload.middleware";
import { BusinessController } from "../controller/business.controller";
const businessRouter = Router();
const businessController = new BusinessController();

// Public routes

businessRouter.post("/register", businessController.registerBusiness);

businessRouter.post("/login", businessController.businessLogin);

// Protected Routes

// router.post("/reset-password/:token", authController.resetPassword);
export default businessRouter;
