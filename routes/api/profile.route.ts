import { Router } from "express";
import {
	getProfile,
	updateProfile,
} from "../../controllers/profile.controller";

const profileRoute: Router = Router();

profileRoute.get("/get", getProfile);
profileRoute.patch("/update", updateProfile);

export default profileRoute;
