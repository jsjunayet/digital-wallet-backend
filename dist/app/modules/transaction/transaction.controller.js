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
exports.TransactionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const transaction_service_1 = require("./transaction.service");
const createTransfer = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.id;
    const result = yield transaction_service_1.TransactionService.createTransfer(req.body, senderId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Your transaction made successfully",
        data: result,
    });
}));
const addMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield transaction_service_1.TransactionService.addMoney(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "money added to your account successfully",
        data: result,
    });
}));
const withdrawMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    console.log("object id", userId, req.user);
    const result = yield transaction_service_1.TransactionService.withdrawMoney(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "money withdraw from your account successfully",
        data: result,
    });
}));
const cashIn = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield transaction_service_1.TransactionService.cashIn(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "money added to your account successfully",
        data: result,
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.user.id;
    const result = yield transaction_service_1.TransactionService.cashOut(agentId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "money cash out to from account successfully",
        data: result,
    });
}));
const getAllTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.getAllTransaction();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All Transaction  retrieved Successfully !",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const result = yield transaction_service_1.TransactionService.getSingleTransaction(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Your Transaction  retrieved Successfully !",
        data: result.data,
    });
}));
const updateTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield transaction_service_1.TransactionService.updateTransaction(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Your Transaction  info id updated",
        data: result,
    });
}));
const deleteTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.deleteTransaction(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Your Transaction  is deleted",
        data: result,
    });
}));
exports.TransactionController = {
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
