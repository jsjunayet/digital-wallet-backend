import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}
export enum AccountType {
  PERSONAL = "personal",
  BUSINESS = "business",
}
export interface IWallet {
  id?: Types.ObjectId;
  ownerId: Types.ObjectId; // User
  balance?: number;
  status?: WalletStatus;
  accountType: AccountType;
  dailyLimit?: number;
  monthlyLimit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
