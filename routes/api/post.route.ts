import { Request, Response, Router } from "express";
import {
	createPost,
	getAllPosts,
	getPostBySlug,
	getPostsByCategory,
	updatePost,
} from "../../controllers/post.controller";
import upload from "../../middleware/multer.middleware";

const postRoute: Router = Router();

postRoute.get("/get", getAllPosts);
postRoute.get("/get/:slug", getPostBySlug);
postRoute.post("/create", upload.single("image"), createPost);
postRoute.patch("/update:slug", upload.single("image"), updatePost);
postRoute.delete("/delete/:slug", updatePost);
postRoute.get("/get-by-category/:category", getPostsByCategory);

export default postRoute;
