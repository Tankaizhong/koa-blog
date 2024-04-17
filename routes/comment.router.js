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
    const currentDate = new Date();
    const isoDate = currentDate.toISOString();
    // 创建评论
    const newComment = await Comments.create({
      Content,
      PostID,
      UserID,
      ParentCommentID,
      Likes,
      CommentDate: isoDate, // 将 ISO 格式的日期字符串分配给 CommentDate
    });

    // 如果成功创建评论，返回新评论的数据
    res.status(201).json(newComment);
  } catch (error) {
    // 如果创建评论失败，返回错误信息
    console.error("Failed to create comment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});

//获得所有评论
router.get("/getAllComments", async (req, res) => {
  try {
    // 获取所有评论
    const allComments = await Comments.findAll({
      include: [
        { model: User, as: "User", attributes: ["Username"], raw: true }, // 连接查询用户表
        {
          model: Like,
          as: "Likes",
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("LikeID")), "likeCount"],
          ],
        }, // 连接查询点赞表
      ],
    });
    // 如果成功获取评论，将评论数据发送给客户端
    allComments.forEach((comment) => {
      comment.Username = comment["User.Username"]; // 将用户名称移动到顶层属性
      comment.LikeCount = parseInt(comment["Likes.likeCount"] || "0"); // 将点赞数量移动到顶层属性并转换为数字
      delete comment["User.Username"]; // 删除原始嵌套的用户名称属性
      delete comment["Likes.likeCount"]; // 删除原始嵌套的点赞数量属性
    });
    res.status(200).json(allComments);
  } catch (error) {
    // 如果获取评论失败，返回错误信息
    console.error("Failed to get comments:", error);
    res.status(500).json({ message: "Failed to get comments" });
  }
});

router.post("/", async (req, res, next) => {
  console.log("1111111");
});
module.exports = router;
