import express from "express";
import transactionController from "../controllers/transaction.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.post("/transaction", [authMiddleware, aclMiddleware([ROLES.USER])], transactionController.create);
router.get("/transaction", [authMiddleware, aclMiddleware([ROLES.USER, ROLES.SUPERADMIN])], transactionController.getAll);
router.get("/transaction/:id", [authMiddleware, aclMiddleware([ROLES.USER, ROLES.SUPERADMIN])], transactionController.getById);
router.put("/transaction/:id", [authMiddleware, aclMiddleware([ROLES.USER])], transactionController.update);
router.delete("/transaction/:id", [authMiddleware, aclMiddleware([ROLES.USER])], transactionController.remove);

export default router;