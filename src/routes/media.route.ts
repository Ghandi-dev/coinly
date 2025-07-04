import express from "express";
import * as mediaController from "../controllers/media.controller";
import mediaMiddleware from "../middlewares/media.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.post("/media/upload-single", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]), mediaMiddleware.single("file")], mediaController.single);
router.post(
	"/media/upload-multiple",
	[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]), mediaMiddleware.multiple("files")],
	mediaController.multiple
);
router.delete("/media/remove", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN])], mediaController.remove);

export default router;
