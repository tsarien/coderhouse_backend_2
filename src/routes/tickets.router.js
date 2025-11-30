import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();
const ticketController = new TicketController();

router.post("/generate", auth(["user", "admin"]), (req, res) =>
  ticketController.generate(req, res)
);

router.get("/", auth(["admin"]), (req, res) =>
  ticketController.getAll(req, res)
);

router.get("/:tid", auth(["user", "admin"]), (req, res) =>
  ticketController.getOne(req, res)
);

router.delete("/:tid", auth(["admin"]), (req, res) =>
  ticketController.delete(req, res)
);

router.put("/:tid/status", auth(["admin"]), (req, res) =>
  ticketController.updateStatus(req, res)
);

export default router;
