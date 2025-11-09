import express from "express";
import Cart from "../dao/models/cart.model.js";
import Product from "../dao/models/product.model.js";

const cartRouter = express.Router();

const findCart = async (cid, res) => {
  const cart = await Cart.findById(cid);
  if (!cart) {
    res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    return null;
  }
  return cart;
};

const findProduct = async (pid, res) => {
  const product = await Product.findById(pid);
  if (!product) {
    res
      .status(404)
      .json({ status: "error", message: "Producto no encontrado" });
    return null;
  }
  return product;
};

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product");
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener los carritos",
      error: error.message,
    });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({});
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear carrito",
    });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate(
      "products.product"
    );
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener carrito",
    });
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const [cart, product] = await Promise.all([
      findCart(cid, res),
      findProduct(pid, res),
    ]);
    if (!cart || !product) return;

    const item = cart.products.find((p) => p.product.toString() === pid);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    const updatedCart = await cart.save();
    res.json({
      status: "success",
      message: "Producto agregado correctamente",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto al carrito",
    });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser mayor a 0",
      });
    }

    const cart = await findCart(cid, res);
    if (!cart) return;

    const item = cart.products.find((p) => p.product.toString() === pid);
    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({
      status: "success",
      message: "Cantidad actualizada correctamente",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar la cantidad",
    });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await findCart(cid, res);
    if (!cart) return;

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    if (cart.products.length === initialLength) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }

    await cart.save();

    res.json({
      status: "success",
      message: "Producto eliminado correctamente",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto del carrito",
    });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cart = await findCart(req.params.cid, res);
    if (!cart) return;

    cart.products = [];
    await cart.save();

    res.json({
      status: "success",
      message: "Carrito vaciado correctamente",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al vaciar carrito",
    });
  }
});

export default cartRouter;
