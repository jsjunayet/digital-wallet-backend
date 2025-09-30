"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const decimalTwoPlaces = (value) => Number.isFinite(value) && /^\d+(\.\d{1,2})?$/.test(value.toString());
const transactionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, enum: Object.values(transaction_interface_1.TransactionType) },
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
        enum: Object.values(transaction_interface_1.TransactionStatus),
        default: transaction_interface_1.TransactionStatus.PENDING,
    },
}, {
    timestamps: true,
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
