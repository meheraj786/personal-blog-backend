import { Router } from "express";
import {
	login,
	updateEmail,
	updatePassword,
} from "../../controllers/user.controller";
import { auth } from "../../middleware/auth.middleware";

const userRoute: Router = Router();

userRoute.post("/login", login);
userRoute.patch("/email", auth, updateEmail);
userRoute.patch("/password", auth, updatePassword);

export default userRoute;
