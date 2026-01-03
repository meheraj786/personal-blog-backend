import { Router } from "express";
import apiRoutes from "./api";

const router: Router = Router();

router.use("/api/v1", apiRoutes);

export default router;
