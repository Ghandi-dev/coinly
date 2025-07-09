import mongoose, { ObjectId } from "mongoose";
import { USER_MODEL_NAME } from "./user.model";
import { TypeIncome } from "../validations/income.validation";

export const INCOME_MODEL_NAME = "Incomes";

export interface Incomes extends Omit<TypeIncome, 'userId'> {
    userId: ObjectId;
}

const IncomeSchema = new mongoose.Schema<Incomes>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true },
        amount: { type: Number, required: true },
        charityBudget: { type: Number, required: true },
        emergencyBudget: { type: Number, required: true },
        livingBudget: { type: Number, required: true },
        entertainmentBudget: { type: Number, required: true },
        otherBudget: { type: Number, default: 0 },
        date: { type: Date, required: true }
    },
    { timestamps: true }
);

const IncomeModel = mongoose.model<Incomes>(INCOME_MODEL_NAME, IncomeSchema);

export default IncomeModel;