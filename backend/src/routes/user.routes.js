const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { isValidEmail } = require("../middlewares/middleware");

router.post(
  "/users",
  isValidEmail,
  userController.createUser.bind(userController)
);
router.get("/getUser", userController.alluser.bind(userController));

module.exports = router;
