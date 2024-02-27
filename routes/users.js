var express = require("express");
var router = express.Router({
  prefix: "/users",
});

const { login } = require("../controller/user.controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// 登录接口
router.post("/login", login);

module.exports = router;
