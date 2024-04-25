const express = require("express");

const { Comments, User, Like } = require("../db/associations");
const sequelize = require("sequelize");
// 导入评论相关的模型和方法
const router = express.Router({
  prefix: "/comments",
});

// POST 请求路由，用于提交评论
router.post("/addComments", async (req, res) => {
  console.log(req.body);
  try {
    // 从请求体中获取评论数据
    const { Content, PostID, UserID, ParentCommentID, Likes } =
      req.body.Comment;

    // 创建评论
    const newComment = await Comments.create({
      Content,
      PostID,
      UserID,
      ParentCommentID,
      Likes,
      CommentDate: new Date().toLocaleString(), // 将 ISO 格式的日期字符串分配给 CommentDate
    });

    // 如果成功创建评论，返回新评论的数据
    res.status(201).json(newComment);
  } catch (error) {
    // 如果创建评论失败，返回错误信息
    console.error("Failed to create comment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});

//根据文章ID获得评论
router.get("/getCommentsByPostID", async (req, res) => {
  try {
    // console.log(, "req.params.articleId")
    const { PostID } = req.query;
    // console.log(PostID,'999999999')
    // 获取所有评论
    const allComments = await Comments.findAll({
      where: { PostID }, // 根据文章ID过滤评论
      include: [
        {
          model: User,
          as: "User",
          attributes: ["Username", "Avatar"],
          raw: true,
        }, // 连接查询用户表
        {
          model: Like,
          as: "Likes",
          // where: { CommentID: sequelize.col('Comment.CommentID') }, // 添加条件来限制只查找与特定评论相关的点赞
          attributes: ["LikeID"],
        }, // 连接查询点赞表
      ],
    });
    // 如果成功获取评论，将评论数据发送给客户端
    console.log(allComments);
    // const commentsToSend = allComments ? allComments : [];
    res.status(200).json(allComments);
  } catch (error) {
    // 如果获取评论失败，返回错误信息
    console.error("Failed to get comments:", error);
    res.status(500).json({ message: "Failed to get comments" });
  }
});

router.get("/likeCount", async (req, res) => {
  try {
    const { CommentID } = req.query;
    console.log(req.query);
    // 在这里根据 commentID 查询数据库获取评论的点赞数
    // 假设你使用 Sequelize 来查询数据库，以下是一个示例代码
    const likeCount = await Like.count({
      where: {
        CommentID,
      },
    });

    res.json({ likeCount }); // 将点赞数作为 JSON 数据发送给前端
  } catch (error) {
    console.error("Failed to fetch like count:", error);
    res.status(500).json({ message: "Failed to fetch like count" });
  }
});

//管理员获得全部
router.get("/getAllComments", async (req, res, next) => {
  try {
    const allComments = await Comments.findAll();
    res.status(200).json(allComments);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});
//管理员删除评论
// 处理删除评论的路由
router.post("/deleteComment", async (req, res) => {
  const { CommentID } = req.body;
  try {
    // 根据评论ID查找并删除评论
    const deletedComment = await Comments.destroy({
      where: {
        CommentID,
      },
    });

    if (deletedComment === 0) {
      return res.status(404).json({ message: "未找到评论" });
    }

    // 如果成功删除评论，发送成功响应
    res.status(200).json({ message: "评论删除成功" });
  } catch (error) {
    console.error("删除评论失败：", error);
    res.status(500).json({ message: "删除评论失败" });
  }
});

router.post("/removeLike", async (req, res) => {
  const { CommentID } = req.body;
  try {
    // 在此处编写从数据库中移除点赞的逻辑
    const deletedLike = await Like.destroy({
      where: {
        CommentID: CommentID,
      },
    });

    if (deletedLike === 0) {
      return res.status(404).json({ message: "未找到点赞记录" });
    }
    // 如果成功移除点赞，发送成功响应
    res.status(200).json({ message: "点赞移除成功" });
  } catch (error) {
    console.error("移除点赞失败：", error);
    res.status(500).json({ message: "移除点赞失败" });
  }
});

router.post("/", async (req, res, next) => {
  console.log("1111111");
});
module.exports = router;
