import * as yup from "yup";
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../utils/constant";

export const transactionDTO = yup.object({
  userId: yup.string().required("User ID is required"),
  type: yup.string().required(),
  category: yup.string().when("type",{
    is: (val: string) => val === TRANSACTION_TYPE.EXPENSE,
    then: (schema) =>
      schema.required("Category is required when type is 'expense'"),
    otherwise: (schema) => schema.optional(),
  }),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be a positive number"),
  description: yup.string().when("category", {
    is: (val: string) => val === TRANSACTION_CATEGORY.OTHER,
    then: (schema) =>
      schema.required("Description is required when category is 'other'"),
    otherwise: (schema) => schema.optional(),
  }),
  date: yup
    .date()
    .required("Date is required")
    .typeError("Invalid date format"),
});

export type TypeTransaction = yup.InferType<typeof transactionDTO>;
