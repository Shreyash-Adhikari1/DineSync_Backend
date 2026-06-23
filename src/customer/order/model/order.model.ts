import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * Snapshot of a menu item at time of ordering
 */
export interface IOrderItem {
  menuItemId: Types.ObjectId;

  name: string;

  unitPrice: number;

  quantity: number;

  subtotal: number;

  specialInstructions?: string;

  allergens?: string[];
}
export interface IOrder extends Document {
  restaurantId: Types.ObjectId;

  tableId: Types.ObjectId;

  sessionId: Types.ObjectId;

  memberId: string;

  orderCode: string;

  items: IOrderItem[];

  itemCount: number;

  totalAmount: number;

  sharedItems: IOrderItem[];

  status: "ordered" | "cooking" | "ready" | "served" | "cancelled";

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    specialInstructions: {
      type: String,
      default: "",
    },

    allergens: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);
const OrderSchema = new Schema<IOrder>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      index: true,
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    memberId: {
      type: String,
      required: true,
      index: true,
    },

    orderCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },

    itemCount: {
      type: Number,
      required: true,
      default: 0,
    },

    sharedItems: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["ordered", "cooking", "ready", "served", "cancelled"],
      default: "ordered",
      index: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
