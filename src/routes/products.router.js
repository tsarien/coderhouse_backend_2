import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
const productController = new ProductController();

router.get("/", (req, res) => productController.getProducts(req, res));
router.get("/:pid", (req, res) => productController.getProductById(req, res));
router.post("/", (req, res) => productController.createProduct(req, res));
router.put("/:pid", (req, res) => productController.updateProduct(req, res));
router.delete("/:pid", (req, res) => productController.deleteProduct(req, res));

export default router;
