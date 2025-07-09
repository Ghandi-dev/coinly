import { Response } from "express";
import { IReqUser } from "../utils/interface";
import TransactionModel from "../models/transaction.model";
import response from "../utils/response";
import BalanceModel from "../models/balance.model";
import { adjustUserBalance } from "../utils/adjustUserBalance";
import { transactionDTO } from "../validations/transaction.validation";

const create = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return response.unauthorized(res, "User not authenticated");

        await transactionDTO.validate({ ...req.body, userId });

        const transactionData = { ...req.body, userId };

        const balance = await BalanceModel.findOne({ userId });
        if (!balance) return response.notFound(res, "Balance not found");

        // Cek apakah saldo cukup
        try {
            adjustUserBalance(transactionData, balance, "create");
        } catch (err: any) {
            return response.error(res,err, err.message);
        }

        // Simpan transaksi & balance
        const newTransaction = await TransactionModel.create(transactionData);
        await balance.save();

        return response.success(res, newTransaction, "Transaction created");
    } catch (error) {
        return response.error(res, error, "Failed to create transaction");
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
    try {
        const userId = req.user?.id;
        if (!userId) return response.unauthorized(res, "User not authenticated");

        const transactionId = req.params.id;
        const newData = req.body;

        const previousTransaction = await TransactionModel.findOne({ _id: transactionId, userId });
        if (!previousTransaction) return response.notFound(res, "Transaction not found");

        const userBalance = await BalanceModel.findOne({ userId });
        if (!userBalance) return response.notFound(res, "Balance not found");

        // Simulasi penyesuaian balance dulu
        try {
            adjustUserBalance(
                { ...previousTransaction.toObject(), ...newData }, // data baru
                userBalance,
                "update",
                previousTransaction
            );
        } catch (err: any) {
            return response.error(res,err, err.message);
        }

        // Update transaksi jika penyesuaian balance aman
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
            transactionId,
            newData,
            { new: true }
        );

        await userBalance.save();

        return response.success(res, updatedTransaction, "Transaction updated");
    } catch (error) {
        return response.error(res, error, "Failed to update transaction");
    }
};


const remove = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return response.unauthorized(res, "User not authenticated");
        }

        const transactionId = req.params.id;
        const deletedTransaction = await TransactionModel.findOneAndDelete({
            _id: transactionId,
            userId,
        });

        if (!deletedTransaction) {
            return response.notFound(res, "Transaction not found");
        }

        // Update balance after deletion
        const userBalance = await BalanceModel.findOne({ userId });

        if (!userBalance) {
            return response.notFound(res, "Balance not found for this user");
        }

        adjustUserBalance(deletedTransaction, userBalance, "delete");

        await userBalance.save();

        response.success(
            res,
            deletedTransaction,
            "Transaction deleted and balance updated"
        );
    } catch (error) {
        response.error(res, error, "Failed to delete transaction");
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
