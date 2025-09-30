"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const WalletSchema = new mongoose_1.Schema({
    id: { type: mongoose_1.Types.ObjectId },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 50 },
    status: {
        type: String,
        enum: Object.values(wallet_interface_1.WalletStatus),
        default: wallet_interface_1.WalletStatus.ACTIVE,
    },
    accountType: {
        type: String,
        enum: Object.values(wallet_interface_1.AccountType),
        default: wallet_interface_1.AccountType.PERSONAL,
    },
    dailyLimit: { type: Number, default: 50 },
    monthlyLimit: { type: Number, default: 500 },
}, {
    timestamps: true,
});
exports.Wallet = (0, mongoose_1.model)("Wallet", WalletSchema);
