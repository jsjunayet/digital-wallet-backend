import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
// import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status-codes";
import { Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;
      console.log(verifiedToken);
      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      // ✅ Blocked user
      if (isUserExist.status === Status.BLOCKED) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.status}`
        );
      }

      // ✅ Deleted user
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      // ✅ Agent must be approved
      console.log(isUserExist, "useriss");
      if (
        isUserExist.role === "AGENT" &&
        isUserExist.agentstatus !== "approved"
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `Agent is ${isUserExist.status}. Please wait for admin approval.`
        );
      }

      // ✅ Role permission check
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
