import { Router } from "express";
import { getSite, updateSite } from "../../controllers/site.controller";

const siteRoute: Router = Router();

siteRoute.get("/get", getSite);
siteRoute.patch("/update", updateSite);

export default siteRoute;
