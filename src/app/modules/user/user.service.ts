import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
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

    const hashedPassword = await bcryptjs.hash(
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

  user.status = payload.status;
  await user.save();

  return user;
};
const agenApproved = async (id: string, payload: Partial<IUser>) => {
  const agent = await User.findOne({ _id: id, role: "AGENT" });

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  agent.agentstatus = payload.agentstatus;
  await agent.save();

  return agent;
};
export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  actionUser,
  agenApproved,
  getAllAgents,
};
