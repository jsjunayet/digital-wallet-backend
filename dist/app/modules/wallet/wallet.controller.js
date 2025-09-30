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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const wallet_service_1 = require("./wallet.service");
// const createWallet = catchAsync(async (req: Request, res: Response) => {
//   const result = await WalletService.createWallet(req.body);
//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Your Wallet created successfully",
//     data: result,
//   });
// });
const getAllWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_service_1.WalletService.getAllWallet(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All  Wallet retrieved Successfully !",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const result = yield wallet_service_1.WalletService.getSingleWallet(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Your Wallet retrieved Successfully !",
        data: result,
    });
}));
const updateWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log("wallet control", id);
    const result = yield wallet_service_1.WalletService.updateWallet(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Wallet info is updated",
        data: result,
    });
}));
const deleteWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_service_1.WalletService.deleteWallet(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "This Wallet is deleted",
        data: result,
    });
}));
exports.WalletController = {
    getAllWallet,
    getSingleWallet,
    updateWallet,
    deleteWallet,
};
