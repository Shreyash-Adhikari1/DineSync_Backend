import mongoose, { Document, Schema } from "mongoose";

export interface IBusiness extends Document {
  businessName: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
  role: "business" | "admin";
}

const BusinessSchema = new Schema<IBusiness>(
  {
    businessName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    address: {
      type: String,
    },
    phoneNumber: { type: String },

    role: {
      type: String,
      enum: ["business", "admin"],
      default: "business",
    },
  },
  {
    timestamps: true,
  },
);

export const BusinessModel = mongoose.model<IBusiness>(
  "Business",
  BusinessSchema,
);
