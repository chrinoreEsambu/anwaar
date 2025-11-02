const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Routes publiques
router.post("/users", userController.createUser.bind(userController));

// Routes protégées (nécessitent authentification - à implémenter via middleware)
router.get("/users/stats", userController.getUserStats.bind(userController));
router.get("/users/:id", userController.getUserById.bind(userController));
router.get("/users", userController.getAllUsers.bind(userController));
router.put("/users/:id", userController.updateUser.bind(userController));
router.delete("/users/:id", userController.deleteUser.bind(userController));

module.exports = router;
