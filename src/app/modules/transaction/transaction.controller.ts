import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionService } from "./transaction.service";

const createTransfer = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user.id;
  const result = await TransactionService.createTransfer(req.body, senderId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your transaction made successfully",
    data: result,
  });
});

const addMoney = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await TransactionService.addMoney(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "money added to your account successfully",
    data: result,
  });
});
const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  console.log("object id", userId, req.user);
  const result = await TransactionService.withdrawMoney(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "money withdraw from your account successfully",
    data: result,
  });
});
const cashIn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await TransactionService.cashIn(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "money added to your account successfully",
    data: result,
  });
});
const cashOut = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.user.id;

  const result = await TransactionService.cashOut(agentId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "money cash out to from account successfully",
    data: result,
  });
});
const getAllTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getAllTransaction();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Transaction  retrieved Successfully !",
    data: result.data,
    meta: result.meta,
  });
});
const getSingleTransaction = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;

  const result = await TransactionService.getSingleTransaction(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Transaction  retrieved Successfully !",
    data: result.data,
  });
});

const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TransactionService.updateTransaction(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Transaction  info id updated",
    data: result,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.deleteTransaction(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Transaction  is deleted",
    data: result,
  });
});

export const TransactionController = {
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
