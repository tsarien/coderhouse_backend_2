import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";
import { passportCall } from "../utils.js";

const router = Router();
const controller = new UserController();

router.get("/:uid", passportCall("current"), auth(["admin"]), (req, res) =>
  controller.getUser(req, res)
);
router.put("/:uid", passportCall("current"), auth(["admin"]), (req, res) =>
  controller.updateUser(req, res)
);
router.delete("/:uid", passportCall("current"), auth(["admin"]), (req, res) =>
  controller.deleteUser(req, res)
);

export default router;
