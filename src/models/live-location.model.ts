import mongoose, { Document, Schema } from "mongoose";

const liveLocationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    trackingLink: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    stoppedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface ILiveLocation extends Document {
  userId: string;
  shareId: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  address: string;
  trackingLink: string;
  status: "active" | "inactive";
  startedAt: Date;
  stoppedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const LiveLocationModel = mongoose.model<ILiveLocation>(
  "LiveLocation",
  liveLocationSchema
);
