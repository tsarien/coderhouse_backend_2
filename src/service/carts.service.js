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
    const productExists = await Product.exists({ _id: pid });
    if (!productExists) return { error: "Producto no encontrado" };

    const cart = await this.cartsRepository.getById(cid, false);
    if (!cart) return { error: "Carrito no encontrado" };

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
    return await this.cartsRepository.getById(cid);
  }

  async updateQuantity(cid, pid, quantity) {
    const cart = await this.cartsRepository.getById(cid, false);
    if (!cart) return { error: "Carrito no encontrado" };

    const itemIndex = cart.products.findIndex((p) => {
      const productId = p.product._id?.toString() || p.product.toString();
      return productId === pid;
    });

    if (itemIndex < 0) return { error: "Producto no encontrado en el carrito" };

    cart.products[itemIndex].quantity = quantity;
    await cart.save();
    return await this.cartsRepository.getById(cid);
  }

  async deleteProduct(cid, pid) {
    const cart = await this.cartsRepository.getById(cid, false);
    if (!cart) return { error: "Carrito no encontrado" };

    const initialLength = cart.products.length;
    cart.products = cart.products.filter((p) => {
      const productId = p.product._id?.toString() || p.product.toString();
      return productId !== pid;
    });

    if (cart.products.length === initialLength) {
      return { error: "Producto no encontrado en el carrito" };
    }

    await cart.save();
    return await this.cartsRepository.getById(cid);
  }

  async clearCart(cid) {
    const cleared = await this.cartsRepository.clearCart(cid);
    if (!cleared) return { error: "Carrito no encontrado" };
    return cleared;
  }
}
