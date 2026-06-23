import { HttpError } from "../../../errors/http-error";
import { OrderRepository } from "../repository/order.repository";
import { SessionRepository } from "../../session/repository/session.repository";
import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { getIO } from "../../../socket/socket";

const orderRepo = new OrderRepository();
const sessionRepo = new SessionRepository();

export class OrderService {
  async getOrCreateActiveOrder(sessionId: string, memberId: string) {
    let order = await orderRepo.getActiveOrderByMember(sessionId, memberId);

    if (order) return order;

    const session = await sessionRepo.findSessionById(sessionId);

    if (!session) {
      throw new HttpError(404, "Session not found");
    }
    const sessionIden = new Types.ObjectId(sessionId);
    const newOrder = await orderRepo.createOrder({
      sessionId: sessionIden,
      restaurantId: session.restaurantId,
      tableId: session.tableId,
      memberId,
      orderCode: `ORD_${nanoid(6)}`,
      status: "ordered",
      items: [],
      itemCount: 0,
      totalAmount: 0,
      createdAt: new Date(),
    });

    return newOrder;
  }

  async addItemToOrder(sessionId: string, memberId: string, item: any) {
    const order = await this.getOrCreateActiveOrder(sessionId, memberId);

    const orderItem = {
      menuItemId: item.menuItemId,
      name: item.name,
      unitPrice: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,

      allergens: Array.isArray(item.allergens)
        ? item.allergens
        : item.allergens
          ? item.allergens.split(",").map((a: string) => a.trim())
          : [],

      specialInstructions: item.specialInstructions || "",
    };

    const updated = await orderRepo.addItemToOrder(
      order._id.toString(),
      orderItem,
    );

    if (!updated) {
      throw new HttpError(400, "Failed to add item");
    }

    const updatedOrder = await this.recalculate(order._id.toString());

    const io = getIO();

    io.to(sessionId).emit("order-updated", updatedOrder);

    const hasDrink = updatedOrder.items.some(
      (item: any) => item.category === "drinks",
    );

    if (!hasDrink) {
      const session = await sessionRepo.findSessionById(sessionId);

      if (!session) {
        throw new HttpError(404, "Session not found");
      }

      if (!session.drinksNudgeShown) {
        io.to(sessionId).emit("drink-suggestion", {
          message:
            "No drinks in the order yet. Want to check out our drinks menu?",
        });

        await sessionRepo.markDrinksNudgeShown(sessionId);
      }
    }
    return updatedOrder;
  }

  async removeItemFromOrder(orderId: string, menuItemId: string) {
    const updated = await orderRepo.removeItemFromOrder(orderId, menuItemId);

    if (!updated) {
      throw new HttpError(400, "Failed to remove item");
    }

    const recalculated = await this.recalculate(orderId);

    const order = await orderRepo.getOrderById(orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    const io = getIO();

    io.to(order.sessionId.toString()).emit("order-updated", recalculated);

    return recalculated;
  }

  async cancelOrder(orderId: string) {
    const cancelled = await orderRepo.cancelOrder(orderId);

    if (!cancelled) {
      throw new HttpError(400, "Failed to cancel order");
    }
    const io = getIO();

    io.to(cancelled.sessionId.toString()).emit("order-cancelled", {
      orderId,
    });

    return cancelled;
  }

  async startCooking(orderId: string) {
    const order = await orderRepo.getOrderById(orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    if (order.status !== "ordered") {
      throw new HttpError(400, "Order cannot be moved to cooking");
    }

    const updated = await orderRepo.updateOrderStatus(orderId, "cooking");

    if (!updated) {
      throw new HttpError(400, "Failed to update order status");
    }

    const io = getIO();

    io.to(order.sessionId.toString()).emit("order-status-changed", {
      orderId,
      status: "cooking",
    });

    return updated;
  }

  async markCooked(orderId: string) {
    const order = await orderRepo.getOrderById(orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    if (order.status !== "cooking") {
      throw new HttpError(400, "Order is not being cooked");
    }

    const updated = await orderRepo.updateOrderStatus(orderId, "ready");

    if (!updated) {
      throw new HttpError(400, "Failed to update order status");
    }
    const io = getIO();
    io.to(order.sessionId.toString()).emit("order-status-changed", {
      orderId,
      status: "ready",
    });

    return updated;
  }
  async markServed(orderId: string) {
    const order = await orderRepo.getOrderById(orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    if (order.status !== "ready") {
      throw new HttpError(400, "Order is not ready to be served");
    }

    const updated = await orderRepo.updateOrderStatus(orderId, "served");

    if (!updated) {
      throw new HttpError(400, "Failed to update order status");
    }
    const io = getIO();

    io.to(order.sessionId.toString()).emit("order-status-changed", {
      orderId,
      status: "served",
    });

    return updated;
  }
  async getOrdersBySession(sessionId: string) {
    return orderRepo.getOrdersBySession(sessionId);
  }

  async getOrdersByMember(sessionId: string, memberId: string) {
    return orderRepo.getOrdersByMember(sessionId, memberId);
  }

  async recalculate(orderId: string) {
    const order = await orderRepo.getOrderById(orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }
    console.log(order.items);
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const totalAmount = order.items.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const updatedOrder = await orderRepo.updateOrderTotals(orderId, {
      itemCount,
      totalAmount,
    });

    if (!updatedOrder) {
      throw new HttpError(400, "Failed to update order totals");
    }

    return updatedOrder;
  }
}
