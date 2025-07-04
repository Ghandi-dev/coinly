import express from "express";
import { PORT } from "./utils/env";
import cors from "cors";
import db from "./utils/database";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routes";

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Tambahkan sebelum route API
app.use((req, res, next) => {
	if (req.method === "GET") {
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Pragma", "no-cache");
		res.setHeader("Expires", "0");
	}
	next();
});

app.use("/api", router);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Hello from back-end-puskesmas!",
		data: null,
	});
});

// docs(app);

app.use(errorMiddleware.serverRoute());
app.use(errorMiddleware.serverError());

async function init() {
	try {
		const result = await db();
		console.log("database status", result);

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}

init();
export default app;
