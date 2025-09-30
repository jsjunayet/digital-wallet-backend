import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(...Object.values(Role)),
  UserControllers.getAllUsers
);
router.get(
  "/all-agents",
  checkAuth(...Object.values(Role)),
  UserControllers.getAllAgents
);
// router.get(
//   "/:id",
//   checkAuth(...Object.values(Role)),
//   UserControllers.getSingleUser
// );
router.patch(
  "/action/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.actionUser
);
router.get(
  "/user/me",
  checkAuth(...Object.values(Role)),
  UserControllers.getMe
);
router.patch(
  "/agents/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.agenApproved
);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  UserControllers.changePassword
);
router.patch(
  "/profile-edit/edit",
  checkAuth(...Object.values(Role)),
  UserControllers.UserProfileUpdate
);
router.get("/chart-data", UserControllers.getChartData);
router.get("/stats", UserControllers.getAdminStats);

export const UserRoutes = router;
