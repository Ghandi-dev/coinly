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
    const sign = getSign(mode);
    applyBalanceChange(balance, sign * transaction.amount, transaction.category);
  }

  if (mode === "update" && previousTransaction) {
    // rollback transaksi lama
    const oldSign = getSign("delete");
    applyBalanceChange(balance, oldSign * previousTransaction.amount, previousTransaction.category);

    // apply transaksi baru
    const newSign = getSign("create");
    applyBalanceChange(balance, newSign * transaction.amount, transaction.category);
  }
}

function getSign(mode: BalanceAdjustMode): number {
  return mode === "create" ? -1 : 1;
}

function applyBalanceChange(balance: Balance, amountChange: number, category?: string) {
  // Jika akan mengurangi saldo dan saldo tidak cukup
  if (amountChange < 0 && balance.currentBalance + amountChange < 0) {
    throw new Error("Saldo tidak mencukupi untuk melakukan transaksi ini");
  }

  balance.currentBalance += amountChange;

  switch (category) {
    case TRANSACTION_CATEGORY.CHARITY:
      if (balance.charityFund + amountChange < 0) {
        throw new Error("Charity fund tidak mencukupi untuk melakukan transaksi ini");
      }
      balance.charityFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.EMERGENCY:
      if (balance.emergencyFund + amountChange < 0) {
        throw new Error("Emergency fund tidak mencukupi untuk melakukan transaksi ini");
      }
      balance.emergencyFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.LIVING:
      if (balance.livingFund + amountChange < 0) {
        throw new Error("Living fund tidak mencukupi untuk melakukan transaksi ini");
      }
      balance.livingFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.ENTERTAINMENT:
      if (balance.entertainmentFund + amountChange < 0) {
        throw new Error("Entertainment fund tidak mencukupi untuk melakukan transaksi ini");
      }
      balance.entertainmentFund += amountChange;
      break;
    case TRANSACTION_CATEGORY.OTHER:
      if (balance.otherFund + amountChange < 0) {
        throw new Error("Other fund tidak mencukupi untuk melakukan transaksi ini");
      }
      balance.otherFund += amountChange;
      break;
  }
}
