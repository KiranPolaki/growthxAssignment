import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { registerUser, loginUser } from "../controller/user.controller.js";
import {
  getAdmins,
  uploadAssignment,
} from "../controller/assignment.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
// * Authorized routes with middleware
router.route("/upload").post(auth, uploadAssignment);
router.route("/admins").get(auth, getAdmins);

export default router;
