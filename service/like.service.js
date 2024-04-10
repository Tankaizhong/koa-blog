// like.service.js

const Like = require('../model/like.model');

class LikeService {
  async createLike(UserID, PostID) {
    try {
      const like = await Like.create({
        UserID,
        PostID,
      });
      return like;
    } catch (error) {
      console.error('创建点赞记录失败', error);
      throw error;
    }
  }

  async checkUserLiked(UserID, PostID) {
    try {
      const like = await Like.findOne({
        where: {
          UserID,
          PostID,
        },
      });
      return like !== null;
    } catch (error) {
      console.error('检查用户点赞状态失败', error);
      throw error;
    }
  }

  async cancelLike(UserID, postID) {
    try {
      await Like.destroy({
        where: {
          UserID,
          PostID,
        },
      });
    } catch (error) {
      console.error('取消点赞失败', error);
      throw error;
    }
  }
}

module.exports = new LikeService();
