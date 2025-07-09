import { Balance } from "../models/balance.model";
import { Incomes } from "../models/income.model";

type IncomeAdjustMode = "create" | "delete" | "update";
type FundKey =
  | "charityFund"
  | "emergencyFund"
  | "livingFund"
  | "entertainmentFund"
  | "otherFund";

/**
 * Fungsi utama untuk menyesuaikan balance berdasarkan perubahan income.
 */
export function adjustUserBalanceFromIncome(
  income: Incomes,
  balance: Balance,
  mode: IncomeAdjustMode,
  previousIncome?: Incomes
) {
  if (mode === "update" && !previousIncome) {
    throw new Error("Previous income is required for update mode");
  }

  if (mode === "create" || mode === "delete") {
    const sign = getSign(mode);
    applyIncomeToBalance(balance, income, sign);
  }

  if (mode === "update" && previousIncome) {
    // Rollback income lama
    applyIncomeToBalance(balance, previousIncome, -1);
    // Apply income baru
    applyIncomeToBalance(balance, income, 1);
  }
}

/**
 * Kembalikan arah perubahan berdasarkan mode
 */
function getSign(mode: IncomeAdjustMode): number {
  return mode === "create" ? 1 : -1;
}

/**
 * Terapkan perubahan income ke balance (bisa + atau -)
 */
function applyIncomeToBalance(balance: Balance, income: Incomes, sign: number) {
  const fundChanges: Record<FundKey, number> = {
    charityFund: sign * income.charityBudget,
    emergencyFund: sign * income.emergencyBudget,
    livingFund: sign * income.livingBudget,
    entertainmentFund: sign * income.entertainmentBudget,
    otherFund: sign * (income.otherBudget ?? 0),
  };

  const totalChange = sign * income.amount;

  // Validasi fund tidak negatif
  validateFundNotNegative(balance, fundChanges, totalChange);

  // Update fund masing-masing
  for (const key of Object.keys(fundChanges) as FundKey[]) {
    balance[key] += fundChanges[key];
  }

  balance.totalBalance += totalChange;
  balance.currentBalance += totalChange;
}

/**
 * Validasi agar saldo tidak menjadi negatif akibat perubahan income
 */
function validateFundNotNegative(
  balance: Balance,
  fundChanges: Record<FundKey, number>,
  totalChange: number
) {
  if (balance.currentBalance + totalChange < 0) {
    throw new Error("Saldo tidak mencukupi");
  }

  for (const key of Object.keys(fundChanges) as FundKey[]) {
    const currentValue = balance[key];
    const delta = fundChanges[key];
    if (currentValue + delta < 0) {
      throw new Error(`${key} tidak mencukupi`);
    }
  }
}
