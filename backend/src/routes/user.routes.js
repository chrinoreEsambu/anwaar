const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  isValidEmail,
  verifyToken,
  schekrole,
} = require("../middlewares/middleware");

router.post(
  "/admin/users",
  isValidEmail,
  userController.createUser.bind(userController)
);
router.post("/admin/connexion", isValidEmail, userController.login);

router.get(
  "/admin/getUser",
  verifyToken,
  schekrole,
  userController.alluser.bind(userController)
);
router.put("/admin/update", isValidEmail, userController.updateUser);

module.exports = router;
