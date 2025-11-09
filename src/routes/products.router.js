import express from "express";
import Product from "../dao/models/product.model.js";

const productsRouter = express.Router();

const parseQueryFilter = (query) => {
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
};

productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = parseQueryFilter(query);
    const options = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
    };

    const { docs: products, ...pagination } = await Product.paginate(
      filter,
      options
    );
    res.json({ status: "success", payload: products, ...pagination });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al recuperar los productos",
      error: error.message,
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);

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
});

productsRouter.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar un producto",
      error: error.message,
    });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct)
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });

    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar un producto",
      error: error.message,
    });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);

    if (!deletedProduct)
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });

    res.json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar un producto",
      error: error.message,
    });
  }
});

export default productsRouter;
