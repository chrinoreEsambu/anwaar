const express = require("express");
const router = express.Router();
const {
  isValidEmail,
  verifyToken,
  schekrole,
} = require("../middlewares/middleware");

// Exemple de route de test
router.get("/categories", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Route catégories fonctionne",
  });
});

module.exports = router;
