import mongoose, { ObjectId } from "mongoose";
import { TypeTransaction } from "../validations/transaction.validation";
import { TRANSACTION_CATEGORY} from "../utils/constant";
import { USER_MODEL_NAME } from "./user.model";

export const TRANSACTION_MODEL_NAME = "Transactions";

export interface Transaction extends Omit<TypeTransaction, 'userId'> {
    userId: ObjectId;
}

const TransactionSchema = new mongoose.Schema<Transaction>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true },
        amount: { type: Number, required: true },
        category: { type: String, enum: TRANSACTION_CATEGORY },
        description: { type: String, default: null },
        date: { type: Date, required: true }
    },
    { timestamps: true}
)

const TransactionModel = mongoose.model<Transaction>(TRANSACTION_MODEL_NAME, TransactionSchema);

export default TransactionModel;

