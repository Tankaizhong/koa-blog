// like.service.js

const Like = require("../model/like.model");
const { Posts } = require("../db/associations");
const { updatePostLikes } = require("./post.service");

class LikeService {
  async createPostLike(UserID, PostID) {
    // console.log(PostID, 'PostID099999999999999999999999')
    try {
      const like = await Like.create({
        UserID,
        PostID,
      });
      await updatePostLikes(PostID);
      return like;
    } catch (error) {
      console.error("创建点赞记录失败", error);
      throw error;
    }
  }

  async checkUserLiked(UserID, PostID) {
    // console.log(PostID, 'PostID')
    try {
      const like = await Like.findOne({
        where: {
          UserID,
          PostID,
        },
      });
      // console.log(like);
      return like !== null;
    } catch (error) {
      console.error("检查用户点赞状态失败", error);
      throw error;
    }
  }

  async cancelLike(UserID, PostID) {
    try {
      await Like.destroy({
        where: {
          UserID,
          PostID,
        },
      });
      await updatePostLikes(PostID);
    } catch (error) {
      console.error("取消点赞失败", error);
      throw error;
    }
  }
}

module.exports = new LikeService();
