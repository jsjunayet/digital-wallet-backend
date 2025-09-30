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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const transaction_model_1 = require("../transaction/transaction.model");
const wallet_model_1 = require("../wallet/wallet.model");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
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
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exists");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (!password) {
            throw new Error("Password is required");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const newUser = new user_model_1.User({
            name,
            email,
            role,
            password: hashedPassword,
        });
        yield newUser.save({ session });
        const newWallet = new wallet_model_1.Wallet({
            ownerId: newUser._id,
        });
        yield newWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return {
            user: newUser,
            wallet: newWallet,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to create user and wallet");
    }
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find({ role: "USER" }), query || {});
    const userData = queryBuilder
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        userData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getAllAgents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find({ role: "AGENT" }), query || {});
    const userData = queryBuilder
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        userData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
});
const actionUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (payload.status) {
        user.status = payload.status;
    }
    yield user.save();
    return user;
});
const agenApproved = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findOne({ _id: id, role: "AGENT" });
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    if (payload.agentstatus) {
        agent.agentstatus = payload.agentstatus;
    }
    yield agent.save();
    return agent;
});
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ _id: id }).select("-password");
    return result;
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: userData.email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "This user is not found !");
    }
    // check if user is deleted
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "This user is deleted!");
    }
    // check if old password is correct
    const isMatched = yield bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!isMatched) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Password does not match!");
    }
    // hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(10));
    // update password
    yield user_model_1.User.findOneAndUpdate({ email: userData.email, role: userData.role }, { password: newHashedPassword }, { new: true });
    return { message: "Password changed successfully" };
});
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
const getChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    // ১) Transaction Volume (amount sum + count)
    const transactionAgg = yield transaction_model_1.Transaction.aggregate([
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
    const userAgg = yield user_model_1.User.aggregate([
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
});
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Total Users
    const totalUsers = yield user_model_1.User.countDocuments({ isDeleted: false });
    // Total Agents (approved only)
    const totalAgents = yield user_model_1.User.countDocuments({
        role: "AGENT",
        agentstatus: "approved",
        isDeleted: false,
    });
    // Total Transactions
    const totalTransactions = yield transaction_model_1.Transaction.countDocuments();
    // Total Volume
    const totalVolumeAgg = yield transaction_model_1.Transaction.aggregate([
        { $match: { status: "COMPLETED" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalVolume = ((_a = totalVolumeAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    // System Fees
    const systemFeesAgg = yield transaction_model_1.Transaction.aggregate([
        { $match: { status: "COMPLETED" } },
        { $group: { _id: null, total: { $sum: "$fee" } } },
    ]);
    const systemFees = ((_b = systemFeesAgg[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
    return {
        totalUsers,
        totalAgents,
        totalTransactions,
        totalVolume,
        systemFees,
    };
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserProfileUpdate = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, body, {
        new: true, // return updated doc
        runValidators: true, // validate against schema
    });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return result;
});
exports.UserServices = {
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
