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
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
router.get(
  "/all-agents",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
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
router.patch(
  "/agents/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.agenApproved
);

export const UserRoutes = router;
