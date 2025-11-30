// repository/ticket.repository.js
import Ticket from "../dao/models/ticket.model.js";

export default class TicketRepository {
  async create(data) {
    return await Ticket.create(data);
  }

  async findById(id) {
    return await Ticket.findById(id)
      .populate("purchaser", "first_name last_name email")
      .populate("products.product", "title price thumbnail code category")
      .lean();
  }

  async findAll() {
    return await Ticket.find()
      .populate("purchaser", "first_name last_name email")
      .populate("products.product", "title price thumbnail code category")
      .lean();
  }

  async delete(id) {
    return await Ticket.findByIdAndDelete(id);
  }

  async update(id, data) {
    return await Ticket.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("purchaser", "first_name last_name email")
      .populate("products.product", "title price thumbnail code category")
      .lean();
  }
}
