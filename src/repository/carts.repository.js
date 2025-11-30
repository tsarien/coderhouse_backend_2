// repository/carts.repository.js
import Cart from "../dao/models/cart.model.js";

export default class CartsRepository {
  async getAll() {
    return await Cart.find()
      .populate("products.product", "title price thumbnail code category")
      .lean();
  }

  async createCart() {
    return await Cart.create({});
  }

  async getById(id, lean = true) {
    const query = Cart.findById(id).populate(
      "products.product",
      "title price thumbnail code category stock"
    );
    return lean ? query.lean() : query;
  }

  async save(cart) {
    // Si cart es un objeto lean, usar findByIdAndUpdate
    if (cart._id && !cart.save) {
      return await Cart.findByIdAndUpdate(
        cart._id,
        { products: cart.products },
        { new: true }
      )
        .populate("products.product", "title price thumbnail code category stock")
        .lean();
    }
    // Si es un documento de Mongoose, usar save()
    return await cart.save();
  }

  async clearCart(id) {
    return await Cart.findByIdAndUpdate(
      id,
      { products: [] },
      { new: true }
    ).lean();
  }
}
