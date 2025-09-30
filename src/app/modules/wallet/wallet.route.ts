import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.controller";
const router = express.Router();

// router.post("/", WalletController.createWallet);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.AGENT),
  WalletController.getAllWallet
);
router.get(
  "/getMe",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.AGENT, Role.USER),
  WalletController.getSingleWallet
);
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

export const WalletRoutes = router;
