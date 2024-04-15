// like.control.js

const {
  createLike,
  checkUserLiked,
  cancelLike,

  updatePostLikes,
} = require("../service/like.service");

class LikeControl {
  async addLike(req, res, next) {
    const { PostID } = req.body;
    const { UserID } = req.body.user;
    try {
      const like = await createLike(UserID, PostID);

      res.status(201).json({ message: "点赞成功", like });
    } catch (error) {
      console.error("点赞失败", error);
      res.status(500).json({ message: "点赞失败" });
    }
  }

  async checkUserLiked(req, res, next) {
    try {
      const liked = await checkUserLiked(req.body.user.UserID, req.body.PostID);
      res.status(200).json({ liked });
    } catch (error) {
      console.error("检查用户点赞状态失败", error);
      res.status(500).json({ message: "检查用户点赞状态失败" });
    }
  }

  async cancelLike(req, res, next) {
    const { PostID } = req.body;
    const { UserID } = req.body.user;
    try {
      await cancelLike(UserID, PostID);
      res.status(200).json({ message: "取消点赞成功" });
    } catch (error) {
      console.error("取消点赞失败", error);
      res.status(500).json({ message: "取消点赞失败" });
    }
  }
}

module.exports = new LikeControl();
