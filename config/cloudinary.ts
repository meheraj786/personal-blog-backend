// Cloudinary handles cloud storage for media files
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary using credentials from .env
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath: string) => {
	try {
		// If no file path provided, return null
		if (!localFilePath) return null;

		// Upload the file to Cloudinary
		const result = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto", // auto-detects file type (image, video, etc.)
		});

		console.log("✅ File uploaded successfully:", result.url);

		// Remove local file after successful upload
		fs.unlinkSync(localFilePath);

		return result;
	} catch (error) {
		// Delete local file even if upload fails
		fs.unlinkSync(localFilePath);
		console.error("❌ Cloudinary upload failed:", error);
		return null;
	}
};

// Export function
export default uploadOnCloudinary;
