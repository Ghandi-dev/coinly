import { Response } from "express";
import { IReqUser } from "../utils/interface";
import IncomeModel from "../models/income.model";
import BalanceModel from "../models/balance.model";
import response from "../utils/response";
import { incomeDTO } from "../validations/income.validation";
import { adjustUserBalanceFromIncome } from "../utils/adjustUserBalanceFromIncome";

const create = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return response.unauthorized(res, "User not authenticated");

        const incomeData = { ...req.body, userId };
        await incomeDTO.validate(incomeData);

        const balance = await BalanceModel.findOne({ userId });
        if (!balance) {
            return response.notFound(res, "Balance not found");
        }

        adjustUserBalanceFromIncome(incomeData, balance, "create");
        await balance.save();

        const newIncome = await IncomeModel.create(incomeData);

        return response.success(res, newIncome, "Income created and balance updated");
    } catch (error) {
        return response.error(res, error, "Failed to create income");
    }
};

const update = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return response.unauthorized(res, "User not authenticated");

        const incomeId = req.params.id;
        const newIncomeData = { ...req.body, userId };
        await incomeDTO.validate(newIncomeData);

        const existingIncome = await IncomeModel.findOne({ _id: incomeId, userId });
        if (!existingIncome) {
            return response.notFound(res, "Income not found");
        }

        const balance = await BalanceModel.findOne({ userId });
        if (!balance) {
            return response.notFound(res, "Balance not found");
        }

        adjustUserBalanceFromIncome(newIncomeData, balance, "update", existingIncome);
        await balance.save();

        const updatedIncome = await IncomeModel.findByIdAndUpdate(
            incomeId,
            newIncomeData,
            { new: true }
        );

        return response.success(res, updatedIncome, "Income updated and balance adjusted");
    } catch (error) {
        return response.error(res, error, "Failed to update income");
    }
};

const remove = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return response.unauthorized(res, "User not authenticated");

        const incomeId = req.params.id;
        const deletedIncome = await IncomeModel.findOneAndDelete({ _id: incomeId, userId });

        if (!deletedIncome) {
            return response.notFound(res, "Income not found");
        }

        const balance = await BalanceModel.findOne({ userId });
        if (!balance) {
            return response.notFound(res, "Balance not found");
        }

        adjustUserBalanceFromIncome(deletedIncome, balance, "delete");
        await balance.save();

        return response.success(res, null, "Income deleted and balance adjusted");
    } catch (error) {
        return response.error(res, error, "Failed to delete income");
    }
};

const getAll = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return response.unauthorized(res, "User not authenticated");
        }

        const incomes = await IncomeModel.find({ userId }).sort({ createdAt: -1 });
        return response.success(res, incomes, "Incomes retrieved successfully");
    } catch (error) {
        return response.error(res, error, "Failed to retrieve incomes");
    }
};

const getById = async (req: IReqUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return response.unauthorized(res, "User not authenticated");
        }

        const incomeId = req.params.id;
        const income = await IncomeModel.findOne({ _id: incomeId, userId });

        if (!income) {
            return response.notFound(res, "Income not found");
        }

        return response.success(res, income, "Income retrieved successfully");
    } catch (error) {
        return response.error(res, error, "Failed to retrieve income");
    }
};

const incomeController = {
    create,
    getAll,
    getById,
    update,
    remove,
};

export default incomeController;
