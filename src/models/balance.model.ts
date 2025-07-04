import mongoose, { ObjectId } from "mongoose";
import { USER_MODEL_NAME } from "./user.model";

export const BALANCE_MODEL_NAME = "Balances";

export interface Balance {
    userId: ObjectId;
    totalBalance: number;
    currentBalance: number;
    charityFund: number;
    livingFund: number;
    emergencyFund: number;
    entertainmentFund: number;
    otherFund: number;
}

const BalanceSchema = new mongoose.Schema<Balance>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true },
        totalBalance: { type: Number, required: true, default: 0 },
        currentBalance: { type: Number, required: true, default: 0 },
        charityFund: { type: Number, required: true, default: 0 },
        livingFund: { type: Number, required: true, default: 0 },
        emergencyFund: { type: Number, required: true, default: 0 },
        entertainmentFund: { type: Number, required: true, default: 0 },
        otherFund: { type: Number, required: true, default: 0 }
    },
    { timestamps: true }
);

const BalanceModel = mongoose.model<Balance>(BALANCE_MODEL_NAME, BalanceSchema);

export default BalanceModel;