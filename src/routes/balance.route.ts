import express from "express";
import balanceController from "../controllers/balance.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.get("/balance", [authMiddleware, aclMiddleware([ROLES.USER, ROLES.SUPERADMIN])], balanceController.getBalance);
router.put("/balance", [authMiddleware, aclMiddleware([ROLES.USER])], balanceController.updateBalance);

export default router;