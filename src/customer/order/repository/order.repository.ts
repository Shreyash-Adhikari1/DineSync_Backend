import { IOrder, IOrderItem, OrderModel } from "../model/order.model";

export interface OrderRepositoryInterface {
  createOrder(data: Partial<IOrder>): Promise<IOrder>;

  getOrderById(orderId: string): Promise<IOrder | null>;

  getOrderByCode(orderCode: string): Promise<IOrder | null>;

  getOrdersBySession(sessionId: string): Promise<IOrder[]>;

  getOrdersByMember(sessionId: string, memberId: string): Promise<IOrder[]>;

  getActiveOrderByMember(
    sessionId: string,
    memberId: string,
  ): Promise<IOrder | null>;

  addItemToOrder(orderId: string, item: any): Promise<IOrder | null>;

  removeItemFromOrder(
    orderId: string,
    menuItemId: string,
  ): Promise<IOrder | null>;

  cancelOrder(orderId: string): Promise<IOrder | null>;

  updateOrderStatus(
    orderId: string,
    status: IOrder["status"],
  ): Promise<IOrder | null>;

  deleteOrder(orderId: string): Promise<IOrder | null>;

  // shared items
  addSharedItem(orderId: string, item: IOrderItem): Promise<IOrder | null>;
  getSharedItems(orderId: string): Promise<IOrderItem[]>;
  clearSharedItems(orderId: string): Promise<IOrder | null>;
}

export class OrderRepository implements OrderRepositoryInterface {
  async addSharedItem(
    orderId: string,
    item: IOrderItem,
  ): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $push: { sharedItems: item },
      },
      { returnDocument: "after" },
    ).exec();
  }
  async getSharedItems(orderId: string): Promise<IOrderItem[]> {
    const order = await OrderModel.findById(orderId).lean();

    return order?.sharedItems || [];
  }
  async clearSharedItems(orderId: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          sharedItems: [],
        },
      },
      {
        returnDocument: "after",
      },
    );
  }

  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    const order = new OrderModel(data);
    return await order.save();
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return OrderModel.findById(orderId).exec();
  }

  async getOrderByCode(orderCode: string): Promise<IOrder | null> {
    return OrderModel.findOne({ orderCode }).exec();
  }

  async getOrdersBySession(sessionId: string): Promise<IOrder[]> {
    return OrderModel.find({ sessionId }).exec();
  }

  async getOrdersByMember(
    sessionId: string,
    memberId: string,
  ): Promise<IOrder[]> {
    return OrderModel.find({ sessionId, memberId }).exec();
  }

  async getActiveOrderByMember(
    sessionId: string,
    memberId: string,
  ): Promise<IOrder | null> {
    return OrderModel.findOne({
      sessionId,
      memberId,
      status: { $in: ["ordered", "cooking", "ready"] },
    }).exec();
  }

  async addItemToOrder(orderId: string, item: any): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $push: { items: item },
      },
      { returnDocument: "after" },
    ).exec();
  }

  async removeItemFromOrder(
    orderId: string,
    menuItemId: string,
  ): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $pull: {
          items: { menuItemId },
        },
      },
      { returnDocument: "after" },
    ).exec();
  }

  async cancelOrder(orderId: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        status: "cancelled",
        items: [],
      },
      { returnDocument: "after" },
    ).exec();
  }

  async updateOrderStatus(
    orderId: string,
    status: IOrder["status"],
  ): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { returnDocument: "after" },
    ).exec();
  }

  async deleteOrder(orderId: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndDelete(orderId).exec();
  }

  async updateOrderTotals(
    orderId: string,
    data: { itemCount: number; totalAmount: number },
  ) {
    return await OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          itemCount: data.itemCount,
          totalAmount: data.totalAmount,
        },
      },
      { new: true },
    );
  }

  async getOrderWithItems(orderId: string) {
    return await OrderModel.findById(orderId).lean();
  }
}
