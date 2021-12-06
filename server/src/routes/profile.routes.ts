import { ensureAuthorized } from "../middleware/auth.middleware";
import {
  editProfilesController,
  indexProfilesController,
  newProfileController,
} from "../controllers/profile.controller";
import { Router } from "express";

// ROOT : /api/profiles

const router = Router();

router
  .route("/")
  .post(ensureAuthorized, newProfileController)
  .get(ensureAuthorized, indexProfilesController);

router
  .route("/:id")
  .patch(ensureAuthorized, editProfilesController)
  .delete(ensureAuthorized, editProfilesController);

export default router;
