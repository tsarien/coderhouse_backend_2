// repository/carts.repository.js
import Cart from "../dao/models/cart.model.js";

export default class CartsRepository {
  async getAll() {
    return await Cart.find().populate("products.product");
  }

  async createCart() {
    return await Cart.create({});
  }

  async getById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async save(cart) {
    return await cart.save();
  }

  async clearCart(id) {
    const cart = await Cart.findById(id);
    if (!cart) return null;
    cart.products = [];
    return await cart.save();
  }
}
