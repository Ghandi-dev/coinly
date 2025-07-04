import authRoute from "./auth.route";
import balanceRoute from "./balance.route";
import transactionRoute from "./transaction.route";

const router = require("express").Router();

router.use(authRoute);
router.use(balanceRoute);
router.use(transactionRoute);

export default router;
