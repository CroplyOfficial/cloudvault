import { ensureAuthorized } from "../middleware/auth.middleware";
import {
  deleteProfileController,
  editProfilesController,
  indexProfilesController,
  newProfileController,
  validateProfileController,
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
  .delete(ensureAuthorized, deleteProfileController);

router.route("/validate/:id").get(validateProfileController);

export default router;
