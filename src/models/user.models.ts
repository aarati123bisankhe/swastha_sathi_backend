import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type.ts";

const userMongoSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phonenumber: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      required: false,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    profileUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User", userMongoSchema);