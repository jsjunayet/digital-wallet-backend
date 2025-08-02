/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
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
    if (senderWallet._id.equals(receiverWallet._id)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot send money to yourself"
      );
    }
    if (!senderWallet || !receiverWallet) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Sender or receiver wallet not found"
      );
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
const cashOut = async (userId: string, payload: Partial<ITransaction>) => {
  const { agentId, amount } = payload;
  const amountNumber = Number(amount);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingAgent = await Wallet.findOne({ ownerId: agentId })
      .populate("ownerId")
      .session(session);
    console.log(existingAgent);
    const existingUser = await Wallet.findOne({ ownerId: userId })
      .populate({
        path: "ownerId",
        match: { role: "USER", status: "ACTIVE" },
      })
      .session(session);
    if (existingAgent?.ownerId.agentstatus != "approved") {
      throw new AppError(httpStatus.NOT_FOUND, "approved agent not found");
    }
    if (!existingAgent) {
      throw new AppError(httpStatus.NOT_FOUND, " agent not found");
    }
    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (existingUser!.balance! < amount!) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "User has insufficient balance!"
      );
    }

    existingUser!.balance! -= amountNumber!;
    existingAgent!.balance! += amountNumber!;
    await existingAgent.save({ session });
    await existingUser.save({ session });

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          userId: userId,
          sender: userId,
          receiver: agentId,
          type: "CASH_OUT",
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

const getAllTransaction = async () => {
  const result = await Transaction.find({});
  const totalTransaction = await Transaction.countDocuments();
  return {
    data: result,
    meta: {
      total: totalTransaction,
    },
  };
};
const getSingleTransaction = async (id: string) => {
  const result = await Transaction.find({ userId: id });
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
