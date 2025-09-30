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
exports.WalletService = void 0;
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const wallet_constant_1 = require("./wallet.constant");
const wallet_model_1 = require("./wallet.model");
// const createWallet = async (payload: IWallet) => {
//   const wallet = await Wallet.create(payload);
//   return wallet;
// };
const getAllWallet = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(wallet_model_1.Wallet.find().populate("ownerId"), query || {});
    const walletData = queryBuilder
        .search(wallet_constant_1.walletSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        walletData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ ownerId: id }).populate("ownerId");
    console.log(wallet);
    return wallet;
});
const updateWallet = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingWallet = yield wallet_model_1.Wallet.findById(id);
    if (!existingWallet) {
        throw new Error("Wallet not found.");
    }
    // const ownerId = id;
    // if (existingWallet.ownerId.toString() !== ownerId) {
    //   throw new Error("Unauthorized: You do not own this wallet.");
    // }
    const allowedFields = [
        "accountType",
        "dailyLimit",
        "monthlyLimit",
    ];
    if (!allowedFields) {
        throw new Error("Your input field does not exists !");
    }
    const filteredPayload = {};
    for (const key of allowedFields) {
        if (key in payload) {
            filteredPayload[key] = payload[key];
        }
    }
    const updatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    console.log("updated wallet", updatedWallet);
    return updatedWallet;
});
const deleteWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield wallet_model_1.Wallet.findByIdAndDelete(id);
    return null;
});
exports.WalletService = {
    getAllWallet,
    getSingleWallet,
    updateWallet,
    deleteWallet,
};
