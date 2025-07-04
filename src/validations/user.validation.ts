import * as yup from "yup";

const validatePassword = yup
	.string()
	.required()
	.min(6, "Password must be at least 6 characters")
	.test("at-least-one-uppercase-letter", "Contains at least one uppercase letter", (value) => {
		if (!value) return false;
		const regex = /^(?=.*[A-Z])/;
		return regex.test(value);
	})
	.test("at-least-one-number", "Contains at least one number", (value) => {
		if (!value) return false;
		const regex = /^(?=.*\d)/;
		return regex.test(value);
	});
	
const validatePasswordConfirm = yup
	.string()
	.required()
	.oneOf([yup.ref("password"), ""], "Passwords must match");

export const userLoginDTO = yup.object({
	identifier: yup.string().required(),
	password: validatePassword,
});

export const userUpdatePasswordDTO = yup.object({
	oldPassword: validatePassword,
	password: validatePassword,
	passwordConfirm: validatePasswordConfirm,
});

export const userDTO = yup.object({
	fullname: yup.string().required(),
	username: yup.string().required(),
	email: yup.string().required(),
	password: validatePassword,
	passwordConfirm: validatePasswordConfirm,
});

export type TypeUser = yup.InferType<typeof userDTO>;
