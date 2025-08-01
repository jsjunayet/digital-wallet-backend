import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const decimalTwoPlaces = (value: number) =>
  Number.isFinite(value) && /^\d+(\.\d{1,2})?$/.test(value.toString());

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sender: { type: Schema.Types.ObjectId, ref: "User", default: null },
    receiver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, enum: Object.values(TransactionType) },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
      validate: {
        validator: decimalTwoPlaces,
        message: "Amount must be a number with up to 2 decimal places.",
      },
    },
    fee: {
      type: Number,
      validate: {
        validator: decimalTwoPlaces,
        message: "Fee must be a number with up to 2 decimal places.",
      },
    },

    commission: {
      type: Number,
      validate: {
        validator: decimalTwoPlaces,
        message: "Commission must be a number with up to 2 decimal places.",
      },
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);
export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
