import express from "express";
import incomeController from "../controllers/income.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.post(
    "/incomes",
    [authMiddleware, aclMiddleware([ROLES.USER])],
    incomeController.create
);
router.put(
    "/incomes/:id",
    [authMiddleware, aclMiddleware([ROLES.USER])],
    incomeController.update
);
router.delete(
    "/incomes/:id",
    [authMiddleware, aclMiddleware([ROLES.USER])],
    incomeController.remove
);
router.get(
    "/incomes",
    [authMiddleware, aclMiddleware([ROLES.USER])],
    incomeController.getAll
);
router.get(
    "/incomes/:id",
    [authMiddleware, aclMiddleware([ROLES.USER])],
    incomeController.getById
);

export default router;
