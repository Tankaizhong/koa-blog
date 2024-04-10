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
  getPostByPostID,
  addLike,
  addView,
  fetchCategories,
  fetchTags
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

//查找Top文章
router.get("/getTopPost", getTopPost);


// 增加点赞的路由
router.post('/like',verifyToken, addLike);

// 增加浏览量的路由
router.post('/view', addView);


//获取文章分类的
router.get('/fetchCategories', fetchCategories);
router.get('/fetchTags', fetchTags);





//获取指定文章,最后一个
router.get('/:PostID',getPostByPostID)



module.exports = router;
