import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WalletService } from "./wallet.service";

// const createWallet = catchAsync(async (req: Request, res: Response) => {
//   const result = await WalletService.createWallet(req.body);
//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Your Wallet created successfully",
//     data: result,
//   });
// });

const getAllWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.getAllWallet(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All  Wallet retrieved Successfully !",
    data: result.data,
    meta: result.meta,
  });
});
const getSingleWallet = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;

  const result = await WalletService.getSingleWallet(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Wallet retrieved Successfully !",
    data: result,
  });
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("wallet control", id);
  const result = await WalletService.updateWallet(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet info is updated",
    data: result,
  });
});

const deleteWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.deleteWallet(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "This Wallet is deleted",
    data: result,
  });
});

export const WalletController = {
  getAllWallet,
  getSingleWallet,
  updateWallet,
  deleteWallet,
};
