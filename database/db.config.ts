import mongoose from "mongoose";

export const dbConnect = async (): Promise<void> => {
	const mongoUri = process.env.MONGO_URI;
	console.log(mongoUri);

	if (!mongoUri) {
		console.error("MONGO_URI is not defined in .env");
		process.exit(1);
	}

	try {
		await mongoose.connect(mongoUri);
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection failed:", error);
		process.exit(1);
	}
};
