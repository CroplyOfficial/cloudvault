import { Router } from "express";
import { authorizeUser, newUser } from "../controllers/user.controllers";

// ROOT : /api/users

const router = Router();

router.route("/").post(newUser);
router.route("/login").post(authorizeUser);

export default router;
