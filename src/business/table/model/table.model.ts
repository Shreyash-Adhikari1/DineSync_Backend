import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITable extends Document {
  restaurantId: Types.ObjectId;

  tableNumber: number;

  qrToken: string;
  qrCode: string;

  tableName: string;
  tableCapacity: number;

  isActive: boolean;
  isReserved: boolean;
}

const TableSchema = new Schema<ITable>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    tableNumber: {
      type: Number,
      required: true,
    },

    tableName: {
      type: String,
      required: true,
    },

    tableCapacity: {
      type: Number,
      required: true,
    },

    qrToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    qrCode: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isReserved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Prevent duplicate table numbers within
 * the same restaurant.
 */
TableSchema.index(
  {
    restaurantId: 1,
    tableNumber: 1,
  },
  {
    unique: true,
  },
);

export const TableModel = mongoose.model<ITable>("Table", TableSchema);
