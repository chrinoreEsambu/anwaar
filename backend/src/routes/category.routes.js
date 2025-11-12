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
router.get(
  "/admin/getAllCategory/",
  verifyToken,
  schekrole,
  categoryController.getAllCategory
);
router.put(
  "/admin/updateCategory/",
  verifyToken,
  schekrole,
  categoryController.updateCategory
);
router.delete(
  "/admin/deleteC",
  verifyToken,
  schekrole,
  categoryController.deleteCategory
);

module.exports = router;
