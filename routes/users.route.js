const express = require("express");
// 路由前缀
const router = express.Router({
  prefix: "/user",
});
//上传文件
const upload = require("../config/multerConfig"); // 引入Multer配置文件
//中间件
const {
  userValidator,
  verifyUser,
  verifyLogin,
  crpytPassword,
} = require("../middleware/user.middleware");
const { verifyToken } = require("../middleware/auth.middleware");

// control 层注册
const {
  login,
  register,
  fetchCategoriesList,
  uploadAvatar,
  fetchPostList,
  updateUser,
} = require("../controller/user.controller");
const {
  publish,
  findByUserID,
  updateArticle,
} = require("../controller/post.control");

const {
  validatePost,
  checkDuplicateArticle,
} = require("../middleware/post.middleware");
const { User } = require("../db/associations");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//注册接口
router.post("/register", userValidator, verifyUser, crpytPassword, register);

//登陆接口
router.post("/login", userValidator, verifyLogin, login);

//列表接口
router.get("/categoriesList", fetchCategoriesList);

//根据用户ID获得文章
router.post("/postList", verifyToken, fetchPostList);

//更新用户信息
router.post("/updateUserInfor", verifyToken, updateUser);

//上传头像
router.post("/uploadAvatar", upload.single("file"), verifyToken, uploadAvatar);

//删除用户
router.post("/deleteUser", verifyToken, async (req, res, next) => {
  const { UserID } = req.body;
  // console.log(req.body)
  try {
    const user = await User.findByPk(UserID);
    await user.destroy();
    res.status(200).json({ success: true, message: "用户删除成功" });
  } catch (error) {
    console.error("用户删除失败", error);
    res.status(500).json({ success: false, message: "用户删除失败" });
  }
});

module.exports = router;
