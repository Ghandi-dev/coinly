import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { ROLES } from "../utils/constant";
import { TypeUser } from "../validations/user.validation";
import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, DEFAULT_IMAGE, EMAIL_SMTP_USER } from "../utils/env";

export const USER_MODEL_NAME = "Users";

// interface user
export interface User extends Omit<TypeUser, "passwordConfirm"> {
	isActive: boolean;
	activationCode: string;
	createdAt?: string;
	role: string;
	profilePicture: string;
}

// schema user
const Schema = mongoose.Schema;

// model user
const UserSchema = new Schema<User>(
	{
		fullname: { type: Schema.Types.String, required: true },
		username: { type: Schema.Types.String, required: true, unique: true },
		email: { type: Schema.Types.String, required: true, unique: true },
		password: { type: Schema.Types.String, required: true },
		role: { type: Schema.Types.String, enum: [ROLES.SUPERADMIN, ROLES.USER], default: ROLES.USER, required: true },
		profilePicture: { type: Schema.Types.String, default: DEFAULT_IMAGE },
		isActive: { type: Schema.Types.Boolean, default: false },
		activationCode: { type: Schema.Types.String },
	},
	{ timestamps: true }
);

// encrypt password sebelum disimpan
UserSchema.pre("save", function (next) {
	const user = this;
	user.password = encrypt(user.password);
	if (!user.activationCode) {
		// generate activation code jika belum ada
		user.activationCode = encrypt(user.username + user.email + Date.now().toString());
	}
	next();
});

UserSchema.post("save", async function (doc, next) {
	try {
		const user = doc;
		console.log("sending email to", user.email);

		// Kirim email ke user
		const contentMail = await renderMailHtml("registration-success.ejs", {
			username: user.username,
			fullname: user.fullname,
			email: user.email,
			createdAt: user.createdAt,
			activationLink: `${CLIENT_HOST}/auth/activation/?code=${user.activationCode}`,
		});

		await sendMail({
			from: EMAIL_SMTP_USER,
			to: user.email,
			subject: "Welcome to CalorieMate",
			html: contentMail,
		});
	} catch (error) {
		console.log(error);
	} finally {
		next();
	}
});

// menghapus password dari response
UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

const UserModel = mongoose.model<User>(USER_MODEL_NAME, UserSchema);

export default UserModel;
