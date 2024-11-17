import { Router } from "express";
import { registerAdmin, loginUser } from "../controller/user.controller.js";
import { auth } from "../middlewares/auth.js";
import {
  acceptAssignment,
  getAssignments,
  rejectAssignment,
} from "../controller/assignment.controller.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginUser);
// * Authorized routes with middleware
router.route("/assignments").get(auth, getAssignments);
router.route("/assignments/accept/:id").post(auth, acceptAssignment);
router.route("/assignments/reject/:id").post(auth, rejectAssignment);

export default router;
