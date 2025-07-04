import { Balance } from "../models/balance.model";
import { Transaction } from "../models/transaction.model";
import { TRANSACTION_CATEGORY } from "./constant";

type BalanceAdjustMode = "create" | "delete" | "update";

export function adjustUserBalance(
  transaction: Transaction,
  balance: Balance,
  mode: BalanceAdjustMode,
  previousTransaction?: Transaction // hanya dipakai saat mode update
) {
  if (!transaction) return;

  if (mode === "update" && !previousTransaction) {
    throw new Error("Previous transaction is required for update mode");
  }

  if (mode === "create" || mode === "delete") {
    const sign = getSign(transaction.type, mode);
    applyBalanceChange(balance, sign * transaction.amount,transaction.category);
  }

  if (mode === "update" && previousTransaction) {
    // rollback transaksi lama
    const oldSign = getSign(previousTransaction.type, "delete");
    applyBalanceChange(balance, oldSign * previousTransaction.amount, previousTransaction.category);

    // apply transaksi baru
    const newSign = getSign(transaction.type, "create");
    applyBalanceChange(balance, newSign * transaction.amount, transaction.category);
  }
}

function getSign(type: string, mode: BalanceAdjustMode): number {
  if (mode === "create") return type === "income" ? 1 : -1;
  if (mode === "delete") return type === "income" ? -1 : 1;
  return 0; // akan ditangani di "update"
}

function applyBalanceChange(balance: Balance, amountChange: number,category?: string) {
  if(!category || category === TRANSACTION_CATEGORY.SALARY)balance.totalBalance += amountChange;
  balance.currentBalance += amountChange;

  switch (category) {
    case TRANSACTION_CATEGORY.CHARITY:
      balance.charityFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.EMERGENCY:
      balance.emergencyFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.LIVING:
      balance.livingFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.ENTERTAINMENT:
      balance.entertainmentFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.OTHER:
      balance.otherFund += amountChange;
      break;
  }
}
