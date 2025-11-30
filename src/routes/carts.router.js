import express from "express";
import {
  getCarts,
  createCart,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  deleteProduct,
  clearCart,
} from "../controllers/carts.controller.js";

const router = express.Router();

router.get("/", getCarts);
router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/products/:pid", addProductToCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid/products/:pid", deleteProduct);
router.delete("/:cid", clearCart);

export default router;
