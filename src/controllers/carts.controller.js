import CartsService from "../service/carts.service.js";

const cartsService = new CartsService();

export const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.getCarts();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los carritos", error: error.message });
  }
};

export const createCart = async (req, res) => {
  try {
    const cart = await cartsService.createCart();
    res.status(201).json({ status: "success", message: "Carrito creado correctamente", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al crear el carrito", error: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartsService.getCart(req.params.cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", message: "Carrito obtenido correctamente", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener el carrito por ID", error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const result = await cartsService.addProduct(cid, pid, quantity);

    if (result.error === "Carrito no encontrado")
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    if (result.error === "Producto no encontrado")
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({
      status: "success",
      message: "Producto agregado correctamente",
      payload: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto al carrito", error: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser mayor a 0",
      });

    const result = await cartsService.updateQuantity(cid, pid, quantity);

    if (result.error === "Carrito no encontrado")
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    if (result.error === "Producto no encontrado en el carrito")
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado en el carrito" });

    res.json({
      status: "success",
      message: "Cantidad actualizada",
      payload: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al actualizar la cantidad del producto", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await cartsService.deleteProduct(cid, pid);

    if (result.error === "Carrito no encontrado")
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    if (result.error === "Producto no encontrado en el carrito")
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado en el carrito" });

    res.json({
      status: "success",
      message: "Producto eliminado",
      payload: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar el producto", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const result = await cartsService.clearCart(req.params.cid);

    if (result.error === "Carrito no encontrado")
      return res.status(404).json({ status:"error", message: "Carrito no encontrado" });

    res.json({
      status: "success",
      message: "Carrito vaciado",
      payload: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al vaciar el carrito", error: error.message });
  }
};
