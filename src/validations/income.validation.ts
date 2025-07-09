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
});

export type TypeIncome = yup.InferType<typeof incomeDTO>;