import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMenuItem extends Document {
  restaurantId: Types.ObjectId;

  name: string;
  description?: string;

  price: number;

  category: "mains" | "starters" | "drinks";

  imageUrl?: string;

  isAvailable: boolean;
  isPopular: boolean;

  commonAllergens?: string[];
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["mains", "starters", "drinks"],
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    commonAllergens: {
      type: [String],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const MenuItemModel = mongoose.model<IMenuItem>(
  "MenuItem",
  MenuItemSchema,
);
