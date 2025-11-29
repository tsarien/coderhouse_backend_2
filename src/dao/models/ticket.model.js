import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    default: [],
  },
  status: {
    type: String,
    enum: ["completado", "pendiente", "rechazado"],
    default: "completado",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
