"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = exports.cashOut = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("./transaction.model");
const createTransfer = (payload, sender) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiver, amount } = payload;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find sender and receiver wallets
        const senderWallet = yield wallet_model_1.Wallet.findOne({ ownerId: sender }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ ownerId: receiver }).session(session);
        if (senderWallet &&
            receiverWallet &&
            senderWallet._id.equals(receiverWallet._id)) {
            throw new Error("Sender and Receiver cannot be the same wallet");
        }
        if (!senderWallet || !receiverWallet) {
            throw new Error("Sender or receiver wallet not found");
        }
        if (senderWallet._id.equals(receiverWallet._id)) {
            throw new Error("Sender and receiver wallets cannot be the same");
        }
        if (senderWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        }
        // Update balances
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        // Create transaction
        const transaction = yield transaction_model_1.Transaction.create([
            {
                userId: sender,
                sender,
                receiver,
                amount,
                type: "SEND_MONEY",
                status: "COMPLETED",
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const addMoney = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = payload;
    const amountNumber = Number(amount);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existingWallet = yield wallet_model_1.Wallet.findOne({ ownerId: userId }).session(session);
        if (!existingWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        }
        existingWallet.balance = Number(existingWallet.balance) + amountNumber;
        yield existingWallet.save({ session });
        // Create transaction
        const transaction = yield transaction_model_1.Transaction.create([
            {
                userId,
                type: "ADD_MONEY",
                amount,
                status: "COMPLETED",
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const withdrawMoney = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = payload;
    const amountNumber = Number(amount);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existingWallet = yield wallet_model_1.Wallet.findOne({ ownerId: userId }).session(session);
        if (!existingWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        }
        if (Number(existingWallet.balance) < amountNumber) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        }
        existingWallet.balance = Number(existingWallet.balance) - amountNumber;
        yield existingWallet.save({ session });
        const transaction = yield transaction_model_1.Transaction.create([
            {
                userId,
                type: "WITHDRAW",
                amount,
                status: "COMPLETED",
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashIn = (agentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = payload;
    const amountNumber = Number(amount);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existingAgent = yield wallet_model_1.Wallet.findOne({ ownerId: agentId })
            .populate({
            path: "ownerId",
            match: { role: "AGENT", agentstatus: "approved", status: "ACTIVE" },
        })
            .session(session);
        const existingUser = yield wallet_model_1.Wallet.findOne({ ownerId: userId }).session(session);
        if (!existingAgent) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
        }
        if (!existingUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        if (existingAgent.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent has insufficient balance!");
        }
        existingAgent.balance -= amountNumber;
        existingUser.balance += amountNumber;
        yield existingAgent.save({ session });
        yield existingUser.save({ session });
        // Create transaction
        const transaction = yield transaction_model_1.Transaction.create([
            {
                userId: agentId,
                sender: agentId,
                receiver: userId,
                type: "CASH_IN",
                amount,
                status: "COMPLETED",
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashOut = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, amount } = payload;
    const amountNumber = Number(amount);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // ✅ 1. Find Agent
        const existingAgent = yield user_model_1.User.findById(agentId).session(session);
        if (!existingAgent) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
        }
        if (existingAgent.agentstatus !== "approved") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is not approved");
        }
        // ✅ 2. Find User Wallet (must be active USER)
        const existingUserWallet = yield wallet_model_1.Wallet.findOne({ ownerId: userId })
            .populate({
            path: "ownerId",
            match: { role: "USER", status: "ACTIVE" },
        })
            .session(session);
        if (!existingUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found or inactive");
        }
        // ✅ 3. Find Agent Wallet
        const existingAgentWallet = yield wallet_model_1.Wallet.findOne({
            ownerId: agentId,
        }).session(session);
        if (!existingAgentWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent wallet not found");
        }
        // ✅ 5. Update Balances
        if (existingUserWallet.balance === undefined ||
            existingAgentWallet.balance === undefined) {
            throw new Error("Wallet balance is not defined");
        }
        // Check if user has enough balance
        if (existingUserWallet.balance < amountNumber) {
            throw new Error("Insufficient balance");
        }
        existingUserWallet.balance -= amountNumber;
        existingAgentWallet.balance += amountNumber;
        yield existingUserWallet.save({ session });
        yield existingAgentWallet.save({ session });
        // ✅ 6. Create Transaction Record
        const transaction = yield transaction_model_1.Transaction.create([
            {
                userId: userId,
                sender: userId,
                receiver: agentId,
                type: "CASH_OUT",
                amount: amountNumber,
                status: "COMPLETED",
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.cashOut = cashOut;
// ✅ Make sure your Transaction model is properly imported
// import Transaction from "../models/Transaction";
const getAllTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.Transaction.find({})
        .populate({
        path: "userId",
        select: "name email phone", // specify the fields you want
    })
        .populate({
        path: "receiver",
        select: "name email phone",
    })
        .populate({
        path: "userId", // if you also want the userId details
        select: "name email",
    })
        .sort({ createdAt: -1 });
    const total = yield transaction_model_1.Transaction.countDocuments();
    return {
        data: result,
        meta: { total },
    };
});
const getSingleTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.Transaction.find({ userId: id })
        .populate({
        path: "sender",
        select: "name email phone", // specify the fields you want
    })
        .populate({
        path: "receiver",
        select: "name email phone",
    })
        .populate({
        path: "userId", // if you also want the userId details
        select: "name email",
    })
        .sort({ createdAt: -1 });
    return {
        data: result,
    };
});
const updateTransaction = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingWallet = yield transaction_model_1.Transaction.findById(id);
    if (!existingWallet) {
        throw new Error("Transaction not found.");
    }
    const updatedTransaction = yield transaction_model_1.Transaction.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedTransaction;
});
const deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield transaction_model_1.Transaction.findByIdAndDelete(id);
    return null;
});
exports.TransactionService = {
    createTransfer,
    addMoney,
    withdrawMoney,
    cashIn,
    cashOut: exports.cashOut,
    getAllTransaction,
    getSingleTransaction,
    updateTransaction,
    deleteTransaction,
};
