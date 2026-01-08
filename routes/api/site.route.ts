import { Router } from "express";
import { getSite, updateSite } from "../../controllers/site.controller";
import { auth } from "../../middleware/auth.middleware";
import upload from "../../middleware/multer.middleware";

const siteRoute: Router = Router();

siteRoute.get("/get", auth, getSite);
siteRoute.patch("/update", auth, upload.single("bannerImage"), updateSite);

export default siteRoute;
