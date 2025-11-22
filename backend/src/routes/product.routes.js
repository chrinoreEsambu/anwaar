const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();
const multer = require("../config/multer");
// const { verifyToken, schekrole } = require("../middlewares/middleware");

router.post(
  "/admin/product",

  multer.single("file"),
  productController.createProduct
);

router.get("/admin/getAllProducts", productController.getAllProduts);
router.post("/admin/getProductByName", productController.getProductByName);
router.put("/admin/updateProduct", productController.updateProduct);
router.delete("/admin/delete", productController.deleteproduct);
module.exports = router;
