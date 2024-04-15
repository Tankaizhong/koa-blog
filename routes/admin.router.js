//管理
const express = require("express");
const {
  addTag,
  addCategory,
  createUser,
  fetchUsers,
  fetchUsersList,
  checkSuperAdmin,
  fetchBlogStats,
} = require("../controller/admin.control");
const {
  validateTagName,
  validateCategoryName,
} = require("../middleware/admin.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const {
  userValidator,
  verifyUser,
  crpytPassword,
} = require("../middleware/user.middleware");
const { register } = require("../controller/user.controller");
const router = express.Router({
  prefix: "/admin",
});
//管理员添加tag
router.post("/addTag", validateTagName, addTag);
//管理员添加CategoryName
router.post("/addCategory", validateCategoryName, addCategory);
//

router.post("/users", verifyToken, fetchUsersList);

//添加用户
router.post("/createUser", userValidator, verifyUser, crpytPassword, register);

//查找用户
router.post("/getUserInfo", fetchUsers);

//判断权限
router.get("/checkSuperAdmin", verifyToken, checkSuperAdmin);

//博客系统的状态
router.get("/fetchBlogStats", verifyToken, fetchBlogStats);

module.exports = router;
