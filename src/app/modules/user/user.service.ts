import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { userSearchableFields } from "./user.constant";
import { IUser } from "./user.interface";
import { User } from "./user.model";

// const createUser = async (payload: Partial<IUser>) => {
//   const { name, email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
//   }
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const hashedPassword = await bcryptjs.hash(
//       password as string,
//       Number(envVars.BCRYPT_SALT_ROUND)
//     );

//     //user create
//     const newUser = await User.create(
//       [
//         {
//           name,
//           email,
//           password: hashedPassword,
//         },
//       ],
//       { session }
//     );
//     await Wallet.create([{ ownerId: newUser[0]._id }], {
//       session,
//     });

//     await session.commitTransaction();
//     session.endSession();
//     return {
//       user: newUser[0],
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.log(error);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to create user and wallet"
//     );
//   }
// };

const createUser = async (payload: Partial<IUser>) => {
  const { name, email, password, role } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (!password) {
      throw new Error("Password is required");
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save({ session });

    const newWallet = new Wallet({
      ownerId: newUser._id,
    });

    await newWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      user: newUser,
      wallet: newWallet,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create user and wallet"
    );
  }
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    User.find({ role: "USER" }),
    query || {}
  );
  const userData = queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    userData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};
const getAllAgents = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    User.find({ role: "AGENT" }),

    query || {}
  );
  const userData = queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    userData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};
const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

const actionUser = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.status) {
    user.status = payload.status;
  }

  await user.save();

  return user;
};
const agenApproved = async (id: string, payload: Partial<IUser>) => {
  const agent = await User.findOne({ _id: id, role: "AGENT" });

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  if (payload.agentstatus) {
    agent.agentstatus = payload.agentstatus;
  }

  await agent.save();

  return agent;
};
const getMe = async (id: string) => {
  const result = await User.findOne({ _id: id }).select("-password");

  return result;
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // check if user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
  }

  // check if old password is correct
  const isMatched = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match!");
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(10));

  // update password
  await User.findOneAndUpdate(
    { email: userData.email, role: userData.role },
    { password: newHashedPassword },
    { new: true }
  );

  return { message: "Password changed successfully" };
};
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getChartData = async () => {
  // ১) Transaction Volume (amount sum + count)
  const transactionAgg = await Transaction.aggregate([
    { $match: { status: "COMPLETED" } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        volume: { $sum: "$amount" },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const transactionVolume = transactionAgg.map((item) => ({
    month: monthNames[item._id - 1],
    volume: item.volume,
    transactions: item.transactions,
  }));

  // ২) User Growth (users + agents per month)
  const userAgg = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        users: { $sum: { $cond: [{ $eq: ["$role", "USER"] }, 1, 0] } },
        agents: { $sum: { $cond: [{ $eq: ["$role", "AGENT"] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const userGrowth = userAgg.map((item) => ({
    month: monthNames[item._id - 1],
    users: item.users,
    agents: item.agents,
  }));

  return { transactionVolume, userGrowth };
};
const getAdminStats = async () => {
  // Total Users
  const totalUsers = await User.countDocuments({ isDeleted: false });

  // Total Agents (approved only)
  const totalAgents = await User.countDocuments({
    role: "AGENT",
    agentstatus: "approved",
    isDeleted: false,
  });

  // Total Transactions
  const totalTransactions = await Transaction.countDocuments();

  // Total Volume
  const totalVolumeAgg = await Transaction.aggregate([
    { $match: { status: "COMPLETED" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalVolume = totalVolumeAgg[0]?.total || 0;

  // System Fees
  const systemFeesAgg = await Transaction.aggregate([
    { $match: { status: "COMPLETED" } },
    { $group: { _id: null, total: { $sum: "$fee" } } },
  ]);
  const systemFees = systemFeesAgg[0]?.total || 0;

  return {
    totalUsers,
    totalAgents,
    totalTransactions,
    totalVolume,
    systemFees,
  };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserProfileUpdate = async (id: string, body: Partial<any>) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }

  const result = await User.findByIdAndUpdate(id, body, {
    new: true, // return updated doc
    runValidators: true, // validate against schema
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return result;
};
export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  actionUser,
  agenApproved,
  getAllAgents,
  getMe,
  changePassword,
  UserProfileUpdate,
  getChartData,
  getAdminStats,
};
