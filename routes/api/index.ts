import express, { Request, Response, type Router } from "express";
import postRoute from "./post.route";
import profileRoute from "./profile.route";
import siteRoute from "./site.route";
import userRoute from "./user.route";
import { auth } from "../../middleware/auth.middleware";

const apiRoutes: Router = express.Router();

apiRoutes.use("/post", postRoute);
apiRoutes.use("/auth", userRoute);
apiRoutes.use("/profile", profileRoute);
apiRoutes.use("/site", siteRoute);

export default apiRoutes;
