import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";

const authLogin = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body, "fjdas");
  const loginInfo = await AuthServices.authLogin(req.body);
  console.log("login info", loginInfo);
  setAuthCookie(res, loginInfo);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged In Successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh token received from cookies"
    );
  }
  const tokenInfo = await AuthServices.getNewAccessToken(
    refreshToken as string
  );
  console.log("object token info", tokenInfo);

  setAuthCookie(res, tokenInfo);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New Access Token Retrieved Successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});

export const AuthControllers = {
  authLogin,
  getNewAccessToken,
  logout,
};
