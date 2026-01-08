import { Request, Response, Router } from "express";
import {
	createPost,
	deletePost,
	getAllPosts,
	getPostBySlug,
	getPostsByCategory,
	updatePost,
} from "../../controllers/post.controller";
import { auth } from "../../middleware/auth.middleware";
import upload from "../../middleware/multer.middleware";

const postRoute: Router = Router();

postRoute.get("/get", getAllPosts);
postRoute.get("/get/:slug", getPostBySlug);

// ✅ FIX: Use "image" consistently for both create and update
postRoute.post("/create", auth, upload.single("image"), createPost);
postRoute.patch("/update/:slug", auth, upload.single("image"), updatePost);
postRoute.delete("/delete/:slug", auth, deletePost);

postRoute.get("/get-by-category/:category", getPostsByCategory);

export default postRoute;
