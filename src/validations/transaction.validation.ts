import * as yup from "yup";
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../utils/constant";

export const transactionDTO = yup.object({
  userId: yup.string().required("User ID is required"),
  category: yup.string().required("Category is required").oneOf(Object.values(TRANSACTION_CATEGORY), "Invalid category"),
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
