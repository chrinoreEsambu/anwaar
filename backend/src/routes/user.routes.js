const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  isValidEmail,
  verifyToken,
  schekrole,
} = require("../middlewares/middleware");

// Routes publiques (pas de token requis)
router.post(
  "/users",
  isValidEmail,
  userController.createUser.bind(userController)
);
router.post("/connexion", isValidEmail, userController.login);

// Routes protégées (token requis + admin seulement)
router.get(
  "/getUser",
  verifyToken,
  schekrole,
  userController.alluser.bind(userController)
);

module.exports = router;
