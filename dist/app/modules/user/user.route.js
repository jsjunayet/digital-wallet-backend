"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
router.get("/all-users", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getAllUsers);
router.get("/all-agents", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getAllAgents);
// router.get(
//   "/:id",
//   checkAuth(...Object.values(Role)),
//   UserControllers.getSingleUser
// );
router.patch("/action/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.actionUser);
router.get("/user/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getMe);
router.patch("/agents/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.agenApproved);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.changePassword);
router.patch("/profile-edit/edit", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.UserProfileUpdate);
router.get("/chart-data", user_controller_1.UserControllers.getChartData);
router.get("/stats", user_controller_1.UserControllers.getAdminStats);
exports.UserRoutes = router;
