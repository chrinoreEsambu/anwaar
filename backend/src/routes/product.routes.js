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

module.exports = router;
