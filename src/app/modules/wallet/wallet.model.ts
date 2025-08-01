import { model, Schema, Types } from "mongoose";
import { AccountType, IWallet, WalletStatus } from "./wallet.interface";

const WalletSchema = new Schema<IWallet>(
  {
    id: { type: Types.ObjectId },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 50 },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
    accountType: {
      type: String,
      enum: Object.values(AccountType),
      default: AccountType.PERSONAL,
    },

    dailyLimit: { type: Number, default: 50 },
    monthlyLimit: { type: Number, default: 500 },
  },
  {
    timestamps: true,
  }
);

export const Wallet = model<IWallet>("Wallet", WalletSchema);
