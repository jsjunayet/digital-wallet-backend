import express from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post("/transfer", TransactionController.createTransfer);
router.post(
  "/addMoney",
  checkAuth(Role.ADMIN, Role.AGENT, Role.SUPER_ADMIN, Role.USER),
  TransactionController.addMoney
);
router.post(
  "/withdraw",
  checkAuth(Role.ADMIN, Role.AGENT, Role.SUPER_ADMIN, Role.USER),
  TransactionController.withdrawMoney
);
router.post("/cashIn", checkAuth(Role.AGENT), TransactionController.cashIn);
router.post("/cashOut", checkAuth(Role.AGENT), TransactionController.cashOut);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.getAllTransaction
);
router.get("/my/:id", TransactionController.getSingleTransaction);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.updateTransaction
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.deleteTransaction
);

export const TransactionRoutes = router;
