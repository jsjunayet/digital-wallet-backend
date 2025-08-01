import { model, Schema } from "mongoose";
import { IUser, Role, Status } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    agentstatus: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    commissionRate: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
