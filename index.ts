import dotenv from "dotenv";

dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import { dbConnect } from "./database/db.config";
import routers from "./routes/index";
import { seedDatabase } from "./utils/seeder";

const app: Application = express();
const PORT = process.env.PORT || 5000;
console.log();

(async () => {
	try {
		await dbConnect();

		app.use(
			cors({
				origin: process.env.ORIGIN || "http://localhost:3000",
				credentials: true,
			}),
		);
		app.use(cookieParser());
		app.use(express.json());
		app.use(routers);

		app.get("/", (req, res) => {
			res.send("Hello World!!");
		});

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
		seedDatabase();
	} catch (error) {
		console.error("Something went wrong:", error);
	}
})();
