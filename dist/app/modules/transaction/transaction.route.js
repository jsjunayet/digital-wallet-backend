"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const transaction_controller_1 = require("./transaction.controller");
const router = express_1.default.Router();
router.post("/transfer", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), transaction_controller_1.TransactionController.createTransfer);
router.post("/addMoney", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.AGENT, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.USER), transaction_controller_1.TransactionController.addMoney);
router.post("/withdraw", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.AGENT, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.USER), transaction_controller_1.TransactionController.withdrawMoney);
router.post("/cashIn", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), transaction_controller_1.TransactionController.cashIn);
router.post("/cashOut", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.AGENT, user_interface_1.Role.USER), transaction_controller_1.TransactionController.cashOut);
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), transaction_controller_1.TransactionController.getAllTransaction);
router.get("/getme", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.AGENT, user_interface_1.Role.USER), transaction_controller_1.TransactionController.getSingleTransaction);
// router.patch(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   TransactionController.updateTransaction
// );
// router.delete(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   TransactionController.deleteTransaction
// );
exports.TransactionRoutes = router;
