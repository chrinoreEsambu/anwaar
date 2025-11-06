const express = require("express");
const router = express.Router();
const {
  isValidEmail,
  verifyToken,
  schekrole,
} = require("../middlewares/middleware");
const categoryController = require("../controllers/category.controller");

// Exemple de route de test
router.post("/admin/createCategorie", categoryController.createCategory);

module.exports = router;
