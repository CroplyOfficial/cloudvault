import { Router } from "express";
import { pingController } from "../controllers/app.controllers";

const router = Router();

router.route("/ping").get(pingController);

export default router;
