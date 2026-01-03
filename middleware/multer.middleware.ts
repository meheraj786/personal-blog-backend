// Multer helps handle file uploads in Express

const multer = require("multer");

// Define where and how the uploaded file will be stored locally
const storage = multer.diskStorage({
	// Folder where file will be temporarily stored
	destination: (req: Request, file: any, cb: any) => {
		cb(null, "./public/temp");
	},

	// Define how file name will be saved
	filename: (req: Request, file: any, cb: any) => {
		cb(null, file.originalname); // Keep original name
	},
});

// Create upload instance using the defined storage config
const upload = multer({ storage });

// Export it so routes can use it
export default upload;
