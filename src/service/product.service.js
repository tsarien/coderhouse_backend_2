import ProductRepository from "../repository/product.repository.js";

const productRepository = new ProductRepository();

export default class ProductService {
  async getProducts(queryParams) {
    const { limit = 10, page = 1, sort, query } = queryParams;

    const filter = this.parseQueryFilter(query);
    const options = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
    };

    return productRepository.getProducts(filter, options);
  }

  parseQueryFilter(query) {
    if (!query) return {};
    try {
      return JSON.parse(query);
    } catch {
      if (query.includes(":")) {
        const [field, value] = query.split(":");
        if (field === "category") return { category: value };
        if (field === "status") return { status: value === "true" };
      }
      return { category: query };
    }
  }

  async getProductById(id) {
    return productRepository.getById(id);
  }

  async createProduct(data) {
    return productRepository.createProduct(data);
  }

  async updateProduct(id, data) {
    return productRepository.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return productRepository.deleteProduct(id);
  }
}
