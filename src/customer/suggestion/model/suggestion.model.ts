import mongoose, { Schema, Types, Document } from "mongoose";

export interface ISuggestionVote {
  memberId: string;
  vote: boolean;
}

export interface ISuggestion extends Document {
  sessionId: Types.ObjectId;
  tableId: Types.ObjectId;

  suggesterId: string;

  menuItemId: Types.ObjectId;
  menuItemName: string;
  menuItemPrice: number;

  status: "pending" | "approved" | "rejected" | "expired";

  votes: ISuggestionVote[];

  requiredVotes: number;

  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const SuggestionVoteSchema = new Schema<ISuggestionVote>(
  {
    memberId: {
      type: String,
      required: true,
    },

    vote: {
      type: Boolean,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const SuggestionSchema = new Schema<ISuggestion>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      index: true,
    },

    suggesterId: {
      type: String,
      required: true,
      index: true,
    },

    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
      index: true,
    },

    // Snapshot of item data at suggestion time
    menuItemName: {
      type: String,
      required: true,
    },

    menuItemPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "expired"],
      default: "pending",
      index: true,
    },

    votes: {
      type: [SuggestionVoteSchema],
      default: [],
    },

    requiredVotes: {
      type: Number,
      required: true,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 45000), // 45 seconds
    },
  },
  {
    timestamps: true,
  },
);

export const SuggestionModel = mongoose.model<ISuggestion>(
  "Suggestion",
  SuggestionSchema,
);
