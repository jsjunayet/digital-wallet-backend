import { Types } from "mongoose";

export enum TransactionType {
  ADD_MONEY = "ADD_MONEY",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId | null;
  agentId?: Types.ObjectId | null;
  sender: Types.ObjectId | null;
  receiver: Types.ObjectId | null;
  type?: TransactionType;
  amount: number;
  fee?: number;
  commission?: number;
  status?: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
