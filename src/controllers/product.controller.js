import ProductService from "../service/product.service.js";

const productService = new ProductService();

export default class ProductController {
  async getProducts(req, res) {
    try {
      const products = await productService.getProducts(req.query);
      const { docs, ...pagination } = products;

      res.json({ status: "success", payload: docs, ...pagination });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al recuperar los productos",
        error: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.pid);
      if (!product) {
        return res
          .status(404)
          .json({ status: "error", message: "Producto no encontrado" });
      }

      res.json({ status: "success", payload: product });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener el producto",
        error: error.message,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ status: "success", payload: product });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al agregar un producto",
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(
        req.params.pid,
        req.body
      );
      if (!product)
        return res
          .status(404)
          .json({ status: "error", message: "Producto no encontrado" });

      res.json({ status: "success", payload: product });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar un producto",
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const deleted = await productService.deleteProduct(req.params.pid);

      if (!deleted)
        return res
          .status(404)
          .json({ status: "error", message: "Producto no encontrado" });

      res.json({ status: "success", payload: deleted });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar un producto",
        error: error.message,
      });
    }
  }
}
