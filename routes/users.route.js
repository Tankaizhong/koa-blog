var express = require("express");
var router = express.Router({
  prefix: "/users",
});

//中间件
const { userValidator, verifyUser } = require("../middleware/user.middleware");

// control 层注册
const { register } = require("../controller/user.controller");

const { login } = require("../controller/user.controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// 登录接口
router.post("/login", login);

//注册接口
router.post("/register", userValidator, verifyUser, register);

module.exports = router;
