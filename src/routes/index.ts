import authRoute from "./auth.route";
import balanceRoute from "./balance.route";
import transactionRoute from "./transaction.route";
import incomeRoute from "./income.route";

const router = require("express").Router();

router.use(authRoute);
router.use(balanceRoute);
router.use(transactionRoute);
router.use(incomeRoute);

export default router;
