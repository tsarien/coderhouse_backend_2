// controllers/ticket.controller.js
import TicketService from "../service/ticket.service.js";

const ticketService = new TicketService();

export default class TicketController {
  async generate(req, res) {
    try {
      const userId = req.user?._id;
      const cartId = req.user?.cart;

      if (!userId || !cartId) {
        return res.status(400).json({
          status: "error",
          error: "Usuario no autenticado o carrito no encontrado",
        });
      }

      const ticket = await ticketService.generateTicket(userId, cartId);

      res.status(201).json({
        status: "success",
        message: "Ticket generado correctamente",
        payload: ticket,
      });
    } catch (error) {
      const statusCode = error.message.includes("vacío") ? 400 : 500;
      res.status(statusCode).json({
        status: "error",
        error: error.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      const ticket = await ticketService.getTicket(req.params.tid);
      if (!ticket)
        return res.status(404).json({ error: "Ticket no encontrado" });

      res.json({ status: "success", payload: ticket });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const tickets = await ticketService.getAllTickets();
      res.json({ status: "success", payload: tickets });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await ticketService.deleteTicket(req.params.tid);
      if (!deleted)
        return res.status(404).json({ error: "Ticket no encontrado" });

      res.json({ status: "success", message: "Ticket eliminado" });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res
          .status(400)
          .json({ status: "error", error: "El campo status es requerido" });
      }

      const ticket = await ticketService.updateStatus(req.params.tid, status);
      if (!ticket)
        return res.status(404).json({ error: "Ticket no encontrado" });

      res.json({
        status: "success",
        message: "Estado del ticket actualizado",
        payload: ticket,
      });
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  }
}
