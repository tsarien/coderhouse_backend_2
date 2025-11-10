import express from "express";
import Product from "../dao/models/product.model.js";
import Cart from "../dao/models/cart.model.js";
import { auth } from "../middlewares/auth.js";

const viewsRouter = express.Router();

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

const buildQueryString = (params) => {
  const validParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      validParams[key] = value;
    }
  }
  const search = new URLSearchParams(validParams);
  return search.toString();
};

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = parseQueryFilter(query);

    const options = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
    };

    const result = await Product.paginate(filter, options);

    const baseParams = { limit };
    if (sort) baseParams.sort = sort;
    if (query) baseParams.query = query;

    const buildUrl = (pageNum) =>
      `/?${buildQueryString({ ...baseParams, page: pageNum })}`;

    const pages = Array.from({ length: result.totalPages }, (_, i) => ({
      number: i + 1,
      url: buildUrl(i + 1),
      isCurrent: i + 1 === result.page,
    }));

    const prevLink = result.hasPrevPage ? buildUrl(result.prevPage) : null;
    const nextLink = result.hasNextPage ? buildUrl(result.nextPage) : null;

    const limitOptions = [5, 10, 20, 50].map((v) => ({
      value: v,
      selected: +limit === v,
    }));

    const sortOptions = [
      { value: "", label: "Sin orden", selected: !sort },
      { value: "asc", label: "Menor a mayor", selected: sort === "asc" },
      { value: "desc", label: "Mayor a menor", selected: sort === "desc" },
    ];

    res.render("home", {
      products: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
      pages,
      limitOptions,
      sortOptions,
      query: query || "",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al cargar los productos",
      error: error.message,
    });
  }
});

viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product)
      return res.status(404).send({ message: "Producto no encontrado" });
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).send({
      message: "Error al cargar el producto",
      error: error.message,
    });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    if (!req.params.cid || req.params.cid.trim() === "") {
      return res.status(400).send("ID de carrito inválido");
    }

    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    const validProducts = cart.products.filter((item) => item.product !== null);

    const productsWithSubtotal = validProducts.map((item) => {
      const subtotal = item.product.price * item.quantity;
      return { ...item, subtotal: subtotal.toFixed(2) };
    });

    const total = productsWithSubtotal.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );

    res.render("cart", {
      cartId: req.params.cid,
      products: productsWithSubtotal,
      total: total.toFixed(2),
      hasProducts: productsWithSubtotal.length > 0,
    });
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    if (error.name === "CastError") {
      return res.status(400).send("ID de carrito inválido");
    }
    res.status(500).send("Error al cargar el carrito: " + error.message);
  }
});

viewsRouter.get("/login", (req, res) => {
  if (req.user) return res.redirect("/perfil");
  res.status(200).render("login");
});

viewsRouter.get("/register", (req, res) => {
  if (req.user) return res.redirect("/perfil");
  res.status(200).render("register");
});

viewsRouter.get("/perfil", auth, (req, res) => {
  res.status(200).render("perfil", {
    nombre: req.user.nombre,
    email: req.user.email,
  });
});

export default viewsRouter;
