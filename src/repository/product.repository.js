import Product from "../dao/models/product.model.js";

export default class ProductRepository {
  async getProducts(filter, options) {
    return Product.paginate(filter, options);
  }

  async getById(id) {
    return Product.findById(id);
  }

  async createProduct(data) {
    return Product.create(data);
  }

  async updateProduct(id, data) {
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id) {
    return Product.findByIdAndDelete(id);
  }
}
