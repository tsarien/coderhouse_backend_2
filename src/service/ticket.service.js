// service/ticket.service.js
import TicketRepository from "../repository/ticket.repository.js";
import CartsRepository from "../repository/carts.repository.js";

const ticketRepository = new TicketRepository();
const cartRepository = new CartsRepository();

export default class TicketService {
  async generateTicket(userId, cartId) {
    // Obtener el carrito (ya viene con lean del repositorio)
    const cart = await cartRepository.getById(cartId);

    if (!cart || !cart.products || cart.products.length === 0) {
      throw new Error("El carrito está vacío o no existe.");
    }

    // Filtrar productos válidos y calcular total en una sola pasada
    const productsDetail = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      // Verificar que el producto existe y tiene precio
      if (item.product && item.product.price && item.quantity > 0) {
        const subtotal = item.product.price * item.quantity;
        totalAmount += subtotal;

        productsDetail.push({
          product: item.product._id || item.product,
          quantity: item.quantity,
        });
      }
    }

    if (productsDetail.length === 0) {
      throw new Error("No hay productos válidos en el carrito.");
    }

    // Crear ticket y vaciar carrito en paralelo
    const [newTicket] = await Promise.all([
      ticketRepository.create({
        purchaser: userId,
        amount: totalAmount,
        products: productsDetail,
      }),
      cartRepository.clearCart(cartId),
    ]);

    return newTicket;
  }

  async getTicket(id) {
    return await ticketRepository.findById(id);
  }

  async getAllTickets() {
    return await ticketRepository.findAll();
  }

  async deleteTicket(id) {
    return await ticketRepository.delete(id);
  }

  async updateStatus(id, status) {
    const validStatuses = ["completado", "pendiente", "rechazado"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Estado inválido. Debe ser uno de: ${validStatuses.join(", ")}`
      );
    }
    return await ticketRepository.update(id, { status });
  }
}
