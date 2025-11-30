// service/carts.service.js
import CartsRepository from "../repository/carts.repository.js";
import Product from "../dao/models/product.model.js";

export default class CartsService {
  constructor() {
    this.cartsRepository = new CartsRepository();
  }

  async getCarts() {
    return await this.cartsRepository.getAll();
  }

  async createCart() {
    return await this.cartsRepository.createCart();
  }

  async getCart(cid) {
    return await this.cartsRepository.getById(cid);
  }

  async addProduct(cid, pid, quantity = 1) {
    // Verificar que el producto existe (solo verificar existencia)
    const productExists = await Product.exists({ _id: pid });
    if (!productExists) return { error: "ProductNotFound" };

    // Obtener el carrito (sin lean para poder actualizarlo directamente)
    const cart = await this.cartsRepository.getById(cid, false);
    if (!cart) return { error: "CartNotFound" };

    // Buscar si el producto ya está en el carrito
    const itemIndex = cart.products.findIndex((p) => {
      const productId = p.product._id?.toString() || p.product.toString();
      return productId === pid;
    });

    if (itemIndex >= 0) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    const saved = await cart.save();
    // Retornar con populate para consistencia
    return await this.cartsRepository.getById(cid);
  }

  async updateQuantity(cid, pid, quantity) {
    const cart = await this.cartsRepository.getById(cid, false);
    if (!cart) return { error: "CartNotFound" };

    const itemIndex = cart.products.findIndex((p) => {
      const productId = p.product._id?.toString() || p.product.toString();
      return productId === pid;
    });

    if (itemIndex < 0) return { error: "ProductNotInCart" };

    cart.products[itemIndex].quantity = quantity;
    await cart.save();
    return await this.cartsRepository.getById(cid);
  }

  async deleteProduct(cid, pid) {
    const cart = await this.cartsRepository.getById(cid, false);
    if (!cart) return { error: "CartNotFound" };

    const initialLength = cart.products.length;
    cart.products = cart.products.filter((p) => {
      const productId = p.product._id?.toString() || p.product.toString();
      return productId !== pid;
    });

    if (cart.products.length === initialLength) {
      return { error: "ProductNotInCart" };
    }

    await cart.save();
    return await this.cartsRepository.getById(cid);
  }

  async clearCart(cid) {
    const cleared = await this.cartsRepository.clearCart(cid);
    if (!cleared) return { error: "CartNotFound" };
    return cleared;
  }
}
