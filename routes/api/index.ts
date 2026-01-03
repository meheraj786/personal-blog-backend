import express, { Request, Response, type Router } from "express";
import postRoute from "./post.route";
import profileRoute from "./profile.route";
import siteRoute from "./site.route";
import userRoute from "./user.route";

const apiRoutes: Router = express.Router();

apiRoutes.use("/post", postRoute);
apiRoutes.use("/user", userRoute);
apiRoutes.use("/profile", profileRoute);
apiRoutes.use("/site", siteRoute);

export default apiRoutes;
