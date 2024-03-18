const express = require("express");
// 路由前缀
const router = express.Router({
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
const { login, register } = require("../controller/user.controller");
const {
  publish,
  findByUserID,
  updateArticle,
} = require("../controller/post.control");

const {
  validatePost,
  checkDuplicateArticle,
} = require("../middleware/post.middleware");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//注册接口
router.post("/register", userValidator, verifyUser, crpytPassword, register);

//登陆接口
router.post("/login", userValidator, verifyLogin, login);

module.exports = router;
