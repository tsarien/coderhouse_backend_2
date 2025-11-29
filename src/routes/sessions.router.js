import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import { passportCall } from "../utils.js";
import { auth } from "../middlewares/auth.js";

const router = Router();
const controller = new SessionsController();

router.post("/register", (req, res) => controller.register(req, res));
router.post("/login", (req, res) => controller.login(req, res));

router.get(
  "/current",
  passportCall("current"),
  auth(["user", "admin"]),
  (req, res) => controller.current(req, res)
);

router.get("/logout", (req, res) => controller.logout(req, res));

import {
  requestPasswordReset,
  showResetPasswordForm,
  resetPassword,
} from "../controllers/password.controller.js";

router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
