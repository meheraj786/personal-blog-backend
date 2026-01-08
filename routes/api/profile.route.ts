import { Router } from "express";
import {
	getProfile,
	updateProfile,
} from "../../controllers/profile.controller";
import { auth } from "../../middleware/auth.middleware";
import upload from "../../middleware/multer.middleware";

const profileRoute: Router = Router();

profileRoute.get("/get", auth, getProfile);
profileRoute.patch("/update", auth, upload.single("avatar"), updateProfile);

export default profileRoute;
