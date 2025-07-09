import * as yup from "yup";

export const incomeDTO = yup.object({
    userId: yup.string().required("User ID is required"),
    amount: yup
        .number()
        .required("Amount is required")
        .positive("Amount must be a positive number"),
    charityBudget: yup.number().required("Charity budget is required"),
    emergencyBudget: yup.number().required("Emergency budget is required"),
    livingBudget: yup.number().required("Living budget is required"),
    entertainmentBudget: yup.number().required("Entertainment budget is required"),
    otherBudget: yup.number().default(0),
    date: yup
        .date()
        .required("Date is required")
        .typeError("Invalid date format"),
}).test(
    "budget-total-check",
    "Total budget melebihi jumlah pemasukan (amount)",
    function (values) {
        const {
            amount = 0,
            charityBudget = 0,
            emergencyBudget = 0,
            livingBudget = 0,
            entertainmentBudget = 0,
            otherBudget = 0
        } = values;

        const totalBudget = charityBudget + emergencyBudget + livingBudget + entertainmentBudget + otherBudget;
        return totalBudget <= amount;
    }
);

export type TypeIncome = yup.InferType<typeof incomeDTO>;
