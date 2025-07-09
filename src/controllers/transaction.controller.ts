import { Response } from "express";
import { IReqUser } from "../utils/interface";
import TransactionModel from "../models/transaction.model";
import response from "../utils/response";
import BalanceModel from "../models/balance.model";
import { adjustUserBalance } from "../utils/adjustUserBalance";
import { transactionDTO } from "../validations/transaction.validation";

const create = async (req: IReqUser, res: Response) => {
    const session = await TransactionModel.startSession();
    session.startTransaction();

    try {
        const userId = req.user?.id;
        if (!userId) return response.unauthorized(res, "User not authenticated");

        await transactionDTO.validate({ ...req.body, userId });
        const transactionData = { ...req.body, userId };

        const balance = await BalanceModel.findOne({ userId }).session(session);
        if (!balance) {
            await session.abortTransaction();
            return response.notFound(res, "Balance not found");
        }

        try {
            adjustUserBalance(transactionData, balance, "create");
        } catch (err: any) {
            await session.abortTransaction();
            return response.error(res, err, err.message);
        }

        const newTransaction = await TransactionModel.create([transactionData], { session });
        await balance.save({ session });

        await session.commitTransaction();
        return response.success(res, newTransaction[0], "Transaction created");
    } catch (error) {
        await session.abortTransaction();
        return response.error(res, error, "Failed to create transaction");
    } finally {
        session.endSession();
    }
};



const getAll = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return response.unauthorized(res, "User not authenticated");
        }

        const transactions = await TransactionModel.find({ userId }).sort({
            createdAt: -1,
        });

        response.success(
            res,
            transactions,
            "Transactions fetched successfully"
        );
    } catch (error) {
        response.error(res, error, "Failed to fetch transactions");
    }
};

const getById = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return response.unauthorized(res, "User not authenticated");
        }

        const transactionId = req.params.id;
        const transaction = await TransactionModel.findOne({
            _id: transactionId,
            userId,
        });

        if (!transaction) {
            return response.notFound(res, "Transaction not found");
        }

        response.success(res, transaction, "Transaction fetched successfully");
    } catch (error) {
        response.error(res, error, "Failed to fetch transaction");
    }
};

const update = async (req: IReqUser, res: Response) => {
    const session = await TransactionModel.startSession();
    session.startTransaction();

    try {
        const userId = req.user?.id;
        if (!userId) return response.unauthorized(res, "User not authenticated");

        const transactionId = req.params.id;
        const newData = req.body;

        const previousTransaction = await TransactionModel.findOne({ _id: transactionId, userId }).session(session);
        if (!previousTransaction) {
            await session.abortTransaction();
            return response.notFound(res, "Transaction not found");
        }

        const userBalance = await BalanceModel.findOne({ userId }).session(session);
        if (!userBalance) {
            await session.abortTransaction();
            return response.notFound(res, "Balance not found");
        }

        try {
            adjustUserBalance(
                { ...previousTransaction.toObject(), ...newData },
                userBalance,
                "update",
                previousTransaction
            );
        } catch (err: any) {
            await session.abortTransaction();
            return response.error(res, err, err.message);
        }

        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
            transactionId,
            newData,
            { new: true, session }
        );

        await userBalance.save({ session });
        await session.commitTransaction();

        return response.success(res, updatedTransaction, "Transaction updated");
    } catch (error) {
        await session.abortTransaction();
        return response.error(res, error, "Failed to update transaction");
    } finally {
        session.endSession();
    }
};



const remove = async (req: IReqUser, res: Response) => {
    const session = await TransactionModel.startSession();
    session.startTransaction();

    try {
        const userId = req.user?.id;
        if (!userId) {
            await session.abortTransaction();
            return response.unauthorized(res, "User not authenticated");
        }

        const transactionId = req.params.id;
        const deletedTransaction = await TransactionModel.findOneAndDelete({
            _id: transactionId,
            userId,
        }).session(session);

        if (!deletedTransaction) {
            await session.abortTransaction();
            return response.notFound(res, "Transaction not found");
        }

        const userBalance = await BalanceModel.findOne({ userId }).session(session);
        if (!userBalance) {
            await session.abortTransaction();
            return response.notFound(res, "Balance not found");
        }

        adjustUserBalance(deletedTransaction, userBalance, "delete");
        await userBalance.save({ session });

        await session.commitTransaction();
        return response.success(
            res,
            deletedTransaction,
            "Transaction deleted and balance updated"
        );
    } catch (error) {
        await session.abortTransaction();
        return response.error(res, error, "Failed to delete transaction");
    } finally {
        session.endSession();
    }
};


const transactionController = {
    create,
    getAll,
    getById,
    update,
    remove,
};

export default transactionController;
