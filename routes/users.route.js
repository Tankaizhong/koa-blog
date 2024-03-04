var express = require("express");
var router = express.Router({
  prefix: "/users",
});

//中间件
const {
  userValidator,
  verifyUser,
  verifyLogin,
  crpytPassword,
} = require("../middleware/user.middleware");

// control 层注册
const { register } = require("../controller/user.controller");

const { login } = require("../controller/user.controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//注册接口
router.post("/register", userValidator, verifyUser, crpytPassword, register);

//登陆接口
router.post("/login", userValidator, verifyLogin, login);

module.exports = router;
