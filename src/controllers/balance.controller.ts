import { Response } from "express";
import { IReqUser } from "../utils/interface";
import BalanceModel from "../models/balance.model";
import response from "../utils/response";

const getBalance = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return response.unauthorized(res, "User not authenticated");
        }

        const balance = await BalanceModel.findOne({ userId });
        if (!balance) {
            return response.notFound(res, "Balance not found for this user");
        }
        response.success(res, balance, "Balance fetched successfully");
    } catch (error) {
        response.error(res, error, "Failed to fetch balance");
    }
};

const updateBalance = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return response.unauthorized(res, "User not authenticated");
        }

        const { totalBalance, currentBalance, charityFund, livingFund, emergencyFund, entertainmentFund, otherFund } = req.body;

        const updatedBalance = await BalanceModel.findOneAndUpdate(
            { userId },
            { totalBalance, currentBalance, charityFund, livingFund, emergencyFund, entertainmentFund, otherFund },
            { new: true }
        );

        if (!updatedBalance) {
            return response.notFound(res, "Balance not found for this user");
        }
        response.success(res, updatedBalance, "Balance updated successfully");
    } catch (error) {
        response.error(res, error, "Failed to update balance");
    }
}

const balanceController = {
    getBalance,
    updateBalance
};

export default balanceController;