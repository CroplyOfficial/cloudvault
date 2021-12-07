import { Router } from "express";
import {
  cloudVaultOnboarding,
  pingController,
} from "../controllers/app.controllers";

// ROOT : /api/app

const router = Router();

router.route("/").get(cloudVaultOnboarding);
router.route("/ping").get(pingController);

export default router;
