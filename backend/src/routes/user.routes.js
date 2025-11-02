const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/users", userController.createUser.bind(userController));
router.get("/getUser", userController.alluser.bind(userController));

module.exports = router;
