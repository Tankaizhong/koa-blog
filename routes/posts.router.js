const { verifyToken } = require("../middleware/auth.middleware");
const {
  validatePost,
  checkDuplicateArticle,
} = require("../middleware/post.middleware");
const {
  publish,
  findByUserID,
  updateArticle,
  getTopPost,
} = require("../controller/post.control");
const express = require("express");
const router = express.Router({
  prefix: "/posts",
});

//发表文章
router.post(
  "/publish",
  verifyToken,
  validatePost,
  checkDuplicateArticle,
  publish,
);

//根据userID和Title查找文章
router.get("/find", verifyToken, findByUserID);

//更新文章
router.put("/update", verifyToken, validatePost, updateArticle);

//超找Top文章
router.get("/getTopPost", getTopPost);
module.exports = router;
