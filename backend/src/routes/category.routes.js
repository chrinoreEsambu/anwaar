const express = require("express");
const router = express.Router();
const {
  isValidEmail,
  verifyToken,
  schekrole,
} = require("../middlewares/middleware");
const categoryController = require("../controllers/category.controller");

router.post(
  "/admin/createCategorie",
  verifyToken,
  schekrole,
  categoryController.createCategory
);
router.get("/admin/getAllCategory/", categoryController.getAllCategory);

module.exports = router;
