import { Router } from "express";
import {
	login,
	updateEmail,
	updatePassword,
} from "../../controllers/user.controller";

const userRoute: Router = Router();

userRoute.post("/login", login);
userRoute.patch("/email", updateEmail);
userRoute.patch("/password", updatePassword);

export default userRoute;
