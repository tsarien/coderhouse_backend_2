import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

// MongoDB ya crea automáticamente un índice único en _id, no es necesario crearlo manualmente

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
