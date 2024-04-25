// like.router.js

const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
// const likeControl = require('../controllers/like.control');
const {
  addPostLike,
  checkUserLiked,
  cancelLike,
  addCommentLike,
} = require("../controller/like.control");
const { Like } = require("../db/associations");

const router = express.Router({
  prefix: "/like",
});

// 添加点赞
router.post("/addLike", verifyToken, addPostLike);

// 检查用户是否已点赞
router.post("/checkLike", verifyToken, checkUserLiked);

// 取消点赞
router.post("/removeLike", verifyToken, cancelLike);

router.post("/addCommentLike", verifyToken, addCommentLike);

router.post("/checkCommentLike", verifyToken, async (req, res, next) => {
  const { CommentID } = req.body;
  const { UserID } = req.body.user;

  try {
    // 查询数据库中是否存在指定用户对指定评论的点赞记录
    const existingLike = await Like.findOne({
      where: {
        CommentID,
        UserID,
      },
    });

    // 如果存在点赞记录，则返回 true，表示用户已经点赞了该评论；否则返回 false，表示用户尚未点赞该评论
    if (existingLike) {
      res.status(200).json({ liked: true });
    } else {
      res.status(200).json({ liked: false });
    }
  } catch (error) {
    console.error("检查点赞情况失败", error);
    res.status(500).json({ message: "检查点赞情况失败" });
  }
});

module.exports = router;
