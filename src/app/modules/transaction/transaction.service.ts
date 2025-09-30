/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const createTransfer = async (
  payload: Partial<ITransaction>,
  sender: string
) => {
  const { receiver, amount } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find sender and receiver wallets
    const senderWallet = await Wallet.findOne({ ownerId: sender }).session(
      session
    );
    const receiverWallet = await Wallet.findOne({ ownerId: receiver }).session(
      session
    );
    if (
      senderWallet &&
      receiverWallet &&
      senderWallet._id.equals(receiverWallet._id)
    ) {
      throw new Error("Sender and Receiver cannot be the same wallet");
    }

    if (!senderWallet || !receiverWallet) {
      throw new Error("Sender or receiver wallet not found");
    }

    if (senderWallet._id.equals(receiverWallet._id)) {
      throw new Error("Sender and receiver wallets cannot be the same");
    }

    if (senderWallet.balance! < amount!) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // Update balances
    senderWallet!.balance! -= amount!;
    receiverWallet!.balance! += amount!;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId: sender,
          sender,
          receiver,
          amount,
          type: "SEND_MONEY",
          status: "COMPLETED",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const addMoney = async (userId: string, payload: Partial<ITransaction>) => {
  const { amount } = payload;
  const amountNumber = Number(amount);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingWallet = await Wallet.findOne({ ownerId: userId }).session(
      session
    );

    if (!existingWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    existingWallet.balance = Number(existingWallet.balance) + amountNumber;
    await existingWallet.save({ session });

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId,
          type: "ADD_MONEY",
          amount,
          status: "COMPLETED",
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const withdrawMoney = async (
  userId: string,
  payload: Partial<ITransaction>
) => {
  const { amount } = payload;
  const amountNumber = Number(amount);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingWallet = await Wallet.findOne({ ownerId: userId }).session(
      session
    );

    if (!existingWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (Number(existingWallet.balance) < amountNumber) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    existingWallet.balance = Number(existingWallet.balance) - amountNumber;
    await existingWallet.save({ session });

    const transaction = await Transaction.create(
      [
        {
          userId,
          type: "WITHDRAW",
          amount,
          status: "COMPLETED",
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cashIn = async (agentId: string, payload: Partial<ITransaction>) => {
  const { userId, amount } = payload;
  const amountNumber = Number(amount);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingAgent = await Wallet.findOne({ ownerId: agentId })
      .populate({
        path: "ownerId",
        match: { role: "AGENT", agentstatus: "approved", status: "ACTIVE" },
      })
      .session(session);

    const existingUser = await Wallet.findOne({ ownerId: userId }).session(
      session
    );

    if (!existingAgent) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }
    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (existingAgent!.balance! < amount!) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Agent has insufficient balance!"
      );
    }

    existingAgent!.balance! -= amountNumber!;
    existingUser!.balance! += amountNumber!;
    await existingAgent.save({ session });
    await existingUser.save({ session });

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId: agentId,
          sender: agentId,
          receiver: userId,
          type: "CASH_IN",
          amount,
          status: "COMPLETED",
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const cashOut = async (
  userId: string,
  payload: Partial<ITransaction>
) => {
  const { agentId, amount } = payload;
  const amountNumber = Number(amount);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ 1. Find Agent
    const existingAgent = await User.findById(agentId).session(session);
    if (!existingAgent) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }
    if (existingAgent.agentstatus !== "approved") {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent is not approved");
    }

    // ✅ 2. Find User Wallet (must be active USER)
    const existingUserWallet = await Wallet.findOne({ ownerId: userId })
      .populate({
        path: "ownerId",
        match: { role: "USER", status: "ACTIVE" },
      })
      .session(session);

    if (!existingUserWallet) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "User wallet not found or inactive"
      );
    }

    // ✅ 3. Find Agent Wallet
    const existingAgentWallet = await Wallet.findOne({
      ownerId: agentId,
    }).session(session);
    if (!existingAgentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
    }

    // ✅ 5. Update Balances
    if (
      existingUserWallet.balance === undefined ||
      existingAgentWallet.balance === undefined
    ) {
      throw new Error("Wallet balance is not defined");
    }

    // Check if user has enough balance
    if (existingUserWallet.balance < amountNumber) {
      throw new Error("Insufficient balance");
    }

    existingUserWallet.balance -= amountNumber;
    existingAgentWallet.balance += amountNumber;

    await existingUserWallet.save({ session });
    await existingAgentWallet.save({ session });

    // ✅ 6. Create Transaction Record
    const transaction = await Transaction.create(
      [
        {
          userId: userId,
          sender: userId,
          receiver: agentId,
          type: "CASH_OUT",
          amount: amountNumber,
          status: "COMPLETED",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ✅ Make sure your Transaction model is properly imported
// import Transaction from "../models/Transaction";

const getAllTransaction = async () => {
  const result = await Transaction.find({})
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

  const total = await Transaction.countDocuments();
  return {
    data: result,
    meta: { total },
  };
};

const getSingleTransaction = async (id: string) => {
  const result = await Transaction.find({ userId: id })
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
};
const updateTransaction = async (
  id: string,
  payload: Partial<ITransaction>
) => {
  const existingWallet = await Transaction.findById(id);
  if (!existingWallet) {
    throw new Error("Transaction not found.");
  }
  const updatedTransaction = await Transaction.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTransaction;
};
const deleteTransaction = async (id: string) => {
  await Transaction.findByIdAndDelete(id);
  return null;
};

export const TransactionService = {
  createTransfer,
  addMoney,
  withdrawMoney,
  cashIn,
  cashOut,
  getAllTransaction,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
};
