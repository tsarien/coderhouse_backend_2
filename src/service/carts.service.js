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
    const cart = await this.getCart(cid);
    if (!cart) return { error: "CartNotFound" };

    const product = await Product.findById(pid);
    if (!product) return { error: "ProductNotFound" };

    const item = cart.products.find((p) => p.product.toString() === pid);

    if (item) item.quantity += quantity;
    else cart.products.push({ product: pid, quantity });

    const updated = await this.cartsRepository.save(cart);
    return updated;
  }

  async updateQuantity(cid, pid, quantity) {
    const cart = await this.getCart(cid);
    if (!cart) return { error: "CartNotFound" };

    const item = cart.products.find((p) => p.product.toString() === pid);
    if (!item) return { error: "ProductNotInCart" };

    item.quantity = quantity;

    return await this.cartsRepository.save(cart);
  }

  async deleteProduct(cid, pid) {
    const cart = await this.getCart(cid);
    if (!cart) return { error: "CartNotFound" };

    const initialLength = cart.products.length;
    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    if (cart.products.length === initialLength)
      return { error: "ProductNotInCart" };

    return await this.cartsRepository.save(cart);
  }

  async clearCart(cid) {
    const cleared = await this.cartsRepository.clearCart(cid);
    if (!cleared) return { error: "CartNotFound" };
    return cleared;
  }
}
