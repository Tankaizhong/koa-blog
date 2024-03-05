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
const { verifyToken } = require("../middleware/auth.middleware");

// control 层注册
const { login, register, publish } = require("../controller/user.controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//注册接口
router.post("/register", userValidator, verifyUser, crpytPassword, register);

//登陆接口
router.post("/login", userValidator, verifyLogin, login);

//发表文章
router.post("/publish", verifyToken, publish);

module.exports = router;
