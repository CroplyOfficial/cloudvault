import { Router } from "express";
import {
  getIPController,
  pingController,
} from "../controllers/app.controllers";

const router = Router();

router.route("/").get(getIPController);
router.route("/ping").get(pingController);

export default router;
