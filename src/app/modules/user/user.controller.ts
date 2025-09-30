import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await UserServices.getAllUsers(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});
const getAllAgents = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await UserServices.getAllAgents(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Agents Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result.data,
  });
});

const actionUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const user = await UserServices.actionUser(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user,
  });
});
const getMe = catchAsync(async (req: Request, res: Response) => {
  const id = req?.user?.id;
  const result = await UserServices.getMe(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result,
  });
});
const agenApproved = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  console.log(payload, "fdjfasjfds");

  const result = await UserServices.agenApproved(req.params.id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Wallet is deleted",
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserServices.changePassword(req.user, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sucessfull Password Change",
    data: result,
  });
});
const UserProfileUpdate = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserServices.UserProfileUpdate(req.user.id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Wallet is deleted",
    data: result,
  });
});
const getChartData = catchAsync(async (req, res) => {
  const result = await UserServices.getChartData();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chart data fetched successfully",
    data: result,
  });
});
const getAdminStats = catchAsync(async (req, res) => {
  const result = await UserServices.getAdminStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin stats fetched successfully",
    data: result,
  });
});
export const UserControllers = {
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
