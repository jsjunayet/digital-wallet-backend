"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const wallet_controller_1 = require("./wallet.controller");
const router = express_1.default.Router();
// router.post("/", WalletController.createWallet);
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.AGENT), wallet_controller_1.WalletController.getAllWallet);
router.get("/getMe", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.AGENT, user_interface_1.Role.USER), wallet_controller_1.WalletController.getSingleWallet);
// router.patch(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   WalletController.updateWallet
// );
// router.delete(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   WalletController.deleteWallet
// );
exports.WalletRoutes = router;
