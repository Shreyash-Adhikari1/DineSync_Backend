import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISessionMember {
  memberId: string;
  name: string;
  joinedAt: Date;
}

export interface ISession extends Document {
  restaurantId: Types.ObjectId;

  tableId: Types.ObjectId;
  tableNumber: number;

  members: ISessionMember[];

  status: "active" | "closed";

  drinksNudgeShown: boolean;

  createdAt: Date;
  endedAt: Date;
}

const SessionMemberSchema = new Schema<ISessionMember>(
  {
    memberId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const SessionSchema = new Schema<ISession>(
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

    tableNumber: {
      type: Number,
      required: true,
    },

    members: {
      type: [SessionMemberSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
      index: true,
    },

    drinksNudgeShown: {
      type: Boolean,
      default: false,
    },

    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const SessionModel = mongoose.model<ISession>("Session", SessionSchema);
