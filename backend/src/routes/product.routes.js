const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();
const multer = require("../config/multer");
const { verifyToken, schekrole } = require("../middlewares/middleware");

router.post(
  "/admin/product",
  verifyToken,
  schekrole,
  multer.single("file"),
  productController.createProduct
);

router.get(
  "/admin/products",
  verifyToken,
  schekrole,
  productController.getAllProduts
);

router.get(
  "/admin/getProductByName",
  verifyToken,
  schekrole,
  productController.getProductByName
);

router.put(
  "/admin/updateProduct",
  verifyToken,
  schekrole,
  productController.updateProduct
);

router.delete(
  "/admin/deleteProduct",
  verifyToken,
  schekrole,
  productController.deleteproduct
);

module.exports = router;
