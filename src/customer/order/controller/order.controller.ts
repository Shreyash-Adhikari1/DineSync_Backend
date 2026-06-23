import { Request, Response } from "express";
import { OrderService } from "../service/order.service";
import { HttpError } from "../../../errors/http-error";

const orderService = new OrderService();

export class OrderController {
  addItemToOrder = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;

      const { memberId, item } = req.body;

      if (!sessionId) throw new HttpError(400, "Session ID is required");

      if (!memberId) throw new HttpError(400, "Member ID is required");

      if (!item || typeof item !== "object") {
        throw new HttpError(400, "Item is required");
      }

      if (!item.menuItemId) {
        throw new HttpError(400, "MenuItemId is required");
      }

      if (item.quantity && item.quantity <= 0) {
        throw new HttpError(400, "Quantity must be greater than 0");
      }

      const order = await orderService.addItemToOrder(
        sessionId as string,
        memberId as string,
        item,
      );

      return res.status(200).json({
        success: true,
        message: "Item added to order",
        order,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  removeItemFromOrder = async (req: Request, res: Response) => {
    try {
      const { orderId, menuItemId } = req.params;

      if (!orderId || !menuItemId) {
        throw new HttpError(400, "OrderId and MenuItemId are required");
      }

      const order = await orderService.removeItemFromOrder(
        orderId as string,
        menuItemId as string,
      );

      return res.status(200).json({
        success: true,
        message: "Item removed",
        order,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  cancelOrder = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        throw new HttpError(400, "OrderId is required");
      }

      const order = await orderService.cancelOrder(orderId as string);

      return res.status(200).json({
        success: true,
        message: "Order cancelled",
        order,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  startCooking = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      if (!orderId) throw new HttpError(400, "OrderId required");

      const order = await orderService.startCooking(orderId as string);

      return res.json({ success: true, order });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  markCooked = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      if (!orderId) throw new HttpError(400, "OrderId required");

      const order = await orderService.markCooked(orderId as string);

      return res.json({ success: true, order });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  markServed = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      if (!orderId) throw new HttpError(400, "OrderId required");

      const order = await orderService.markServed(orderId as string);

      return res.json({ success: true, order });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  getOrdersBySession = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) throw new HttpError(400, "SessionId required");

      const orders = await orderService.getOrdersBySession(sessionId as string);

      return res.json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getOrdersByMember = async (req: Request, res: Response) => {
    try {
      const { sessionId, memberId } = req.params;

      if (!sessionId || !memberId) {
        throw new HttpError(400, "SessionId and MemberId required");
      }

      const orders = await orderService.getOrdersByMember(
        sessionId as string,
        memberId as string,
      );

      return res.json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
