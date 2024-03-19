const {
  postPublishError,
  serverError,
  postNotExist,
} = require("../constant/error.type");
const { userSuccessPublish } = require("../constant/success.type");
const { findPostByUserID } = require("../service/post.service");
const {
  publishArticle,
  updateArticle,
  findTopPost,
} = require("../service/post.service");
const Posts = require("../model/posts.model");
const tagService = require("../service/tag.service");

class PostController {
  /**
   * 发表文章
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async publish(req, res, next) {
    try {
      const result = await publishArticle(req.body);
      res.status(200).json({
        ...userSuccessPublish,
        ...result,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json(postPublishError);
    }
  }

  // 根据userID
  async findByUserID(req, res, next) {
    try {
      const post = await findPostByUserID(req.body.user);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json(postNotExist);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(serverError);
    }
  }

  /**
   * 根据userID和Title查找文章
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async updateArticle(req, res, next) {
    try {
      const { UserID, Title, Content } = req.body.user;
      const updatedPost = await updateArticle(UserID, Title, Content);
      if (updatedPost) {
        res.status(200).json(updatedPost);
      } else {
        res.status(404).json(postNotExist);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(serverError);
    }
  }

  //getTopPost
  async getTopPost(req, res, next) {
    try {
      const post = await findTopPost();
    } catch (err) {
      console.log(err);
      res.status(500).json(serverError);
    }
  }
}

module.exports = new PostController();
