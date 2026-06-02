import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRestaurant extends Document {
  ownerId: mongoose.Types.ObjectId;

  restaurantName: string;
  restaurantDescription?: string;
  restaurantLogo?: string;

  restaurantAddress: string;
  restaurantPhoneNumber: string;

  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },

    restaurantDescription: {
      type: String,
      default: "",
    },

    restaurantLogo: {
      type: String,
      default: "",
    },

    restaurantAddress: {
      type: String,
      default: "",
    },

    restaurantPhoneNumber: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const RestaurantModel = mongoose.model<IRestaurant>(
  "Restaurant",
  RestaurantSchema,
);
