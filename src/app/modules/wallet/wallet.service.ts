import { QueryBuilder } from "../../utils/QueryBuilder";
import { walletSearchableFields } from "./wallet.constant";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

// const createWallet = async (payload: IWallet) => {
//   const wallet = await Wallet.create(payload);

//   return wallet;
// };

const getAllWallet = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Wallet.find().populate("ownerId"),
    query || {}
  );
  const walletData = queryBuilder
    .search(walletSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    walletData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};
const getSingleWallet = async (id: string) => {
  const wallet = await Wallet.findOne({ ownerId: id }).populate("ownerId");
  console.log(wallet);
  return wallet;
};
const updateWallet = async (id: string, payload: Partial<IWallet>) => {
  const existingWallet = await Wallet.findById(id);
  if (!existingWallet) {
    throw new Error("Wallet not found.");
  }
  // const ownerId = id;

  // if (existingWallet.ownerId.toString() !== ownerId) {
  //   throw new Error("Unauthorized: You do not own this wallet.");
  // }
  const allowedFields: (keyof IWallet)[] = [
    "accountType",
    "dailyLimit",
    "monthlyLimit",
  ];

  if (!allowedFields) {
    throw new Error("Your input field does not exists !");
  }
  const filteredPayload: Partial<IWallet> = {};
  for (const key of allowedFields) {
    if (key in payload) {
      filteredPayload[key] = payload[key];
    }
  }
  const updatedWallet = await Wallet.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  console.log("updated wallet", updatedWallet);

  return updatedWallet;
};
const deleteWallet = async (id: string) => {
  await Wallet.findByIdAndDelete(id);
  return null;
};

export const WalletService = {
  getAllWallet,
  getSingleWallet,
  updateWallet,
  deleteWallet,
};
