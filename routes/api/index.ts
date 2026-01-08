import express, { Request, Response, type Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import postRoute from "./post.route";
import profileRoute from "./profile.route";
import siteRoute from "./site.route";
import userRoute from "./user.route";

const apiRoutes: Router = express.Router();

apiRoutes.use("/post", postRoute);
apiRoutes.use("/auth", userRoute);
apiRoutes.use("/profile", profileRoute);
apiRoutes.use("/site", siteRoute);

export default apiRoutes;
