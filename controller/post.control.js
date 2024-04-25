const {
  postPublishError,
  serverError,
  postNotExist,
} = require("../constant/error.type");
const { userSuccessPublish } = require("../constant/success.type");
const { findPostByUserID } = require("../service/post.service");
const {
  publishPost,
  updateArticle,
  findTopPost,
  getTopPost,
  findPostByPostID,
  increaseLike,
  addViewToPost,
  getCategories,
  getTags,
  getPostsByCategory,
} = require("../service/post.service");
const Posts = require("../model/posts.model");
const tagService = require("../service/tag.service");
const { Op } = require("@sequelize/core");
const { User, Tags, Like } = require("../db/associations");
const sequelize = require("sequelize");

class PostController {
  /**
   * 发表文章
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async publish(req, res, next) {
    try {
      // console.log(req.body);
      const result = await publishPost(req.body);
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
    // console.log(req.body)
    try {
      const { UserID, Title, Content } = req.body.user;
      const updatedPost = await updatePost(req.body);
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
    console.log(req.body);
    try {
      const { CategoryID } = req.body;
      const topPost = await getTopPost(CategoryID);
      // console.log(topPost)
      res.status(200).json({ success: true, data: topPost });
    } catch (error) {
      next(error);
    }
  }

  async getPostByPostID(req, res, next) {
    try {
      // 在数据库中查找文章
      // console.log(req.params)
      const post = await findPostByPostID(req.params.PostID);
      if (!post) {
        return res.status(404).json({ message: "文章不存在" });
      }
      // 如果找到文章，则将其发送给客户端
      const likeCount = post.Likes ? post.Likes.length : 0;
      res.status(200).json({ ...post.dataValues, Likes: likeCount });
    } catch (error) {
      console.error("获取文章详情失败", error);
      res.status(500).json({ message: "获取文章详情失败" });
    }
  }

  //点赞
  async addLike(req, res, next) {
    const { PostID } = req.body;
    // console.log(PostID,'11111111111111111111')
    try {
      const updatedPost = await increaseLike(PostID);
      res.status(200).json(updatedPost); // 返回更新后的文章数据
    } catch (error) {
      res.status(500).json({ message: "增加点赞失败" });
    }
  }

  //浏览量
  async addView(req, res, next) {
    const { PostID } = req.body;
    // console.log(req.body,'11111111111111111')
    try {
      // 调用增加浏览量的函数
      const updatedPost = await addViewToPost(PostID);
      // 如果更新后的文章不存在，则返回 404
      if (!updatedPost) {
        return res.status(404).json({ message: "文章不存在" });
      }
      // 返回成功的响应
      res.status(200).json({ message: "浏览量增加成功" });
    } catch (error) {
      console.error("增加浏览量失败", error);
      res.status(500).json({ message: "增加浏览量失败" });
    }
  }

  async fetchCategories(req, res, next) {
    try {
      // 调用增加浏览量的函数
      const Categories = await getCategories();
      // 如果更新后的文章不存在，则返回 404
      if (!Categories) {
        return res.status(404).json({ message: "分类不存在" });
      }
      // console.log(Categories)
      // 返回成功的响应
      res.status(200).json(Categories);
    } catch (error) {
      console.error("增加浏览量失败", error);
      res.status(500).json({ message: "获取分类失败" });
    }
  }

  async fetchTags(req, res, next) {
    try {
      // 调用增加浏览量的函数
      const Tags = await getTags();
      // 如果更新后的文章不存在，则返回 404
      if (!Tags) {
        return res.status(404).json({ message: "标签不存在" });
      }
      // 返回成功的响应
      res.status(200).json(Tags);
    } catch (error) {
      console.error("增加浏览量失败", error);
      res.status(500).json({ message: "获取标签失败" });
    }
  }
  async fetchPostList(req, res, next) {
    try {
      // 调用增加浏览量的函数
      const Tags = await getPost();
      // 如果更新后的文章不存在，则返回 404
      if (!Tags) {
        return res.status(404).json({ message: "标签不存在" });
      }
      // 返回成功的响应
      res.status(200).json(Tags);
    } catch (error) {
      console.error("增加浏览量失败", error);
      res.status(500).json({ message: "获取标签失败" });
    }
  }

  async fetchPostByCategory(req, res, next) {
    try {
      console.log(req.params);
      const { CategoryID } = req.body;
      // console.log(req.body)
      const posts = await getPostsByCategory(CategoryID);
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async findBySearch(req, res, next) {
    try {
      const { Query } = req.body;
      console.log(Query, "99999999");
      // Find posts where title or content contains the keyword
      const queryOptions = {
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn("UPPER", sequelize.col("Title")),
              "LIKE",
              `%${Query.toUpperCase()}%`,
            ), // Title contains keyword
            sequelize.where(
              sequelize.fn("UPPER", sequelize.col("Content")),
              "LIKE",
              `%${Query.toUpperCase()}%`,
            ), // Content contains keyword
            sequelize.where(
              sequelize.fn("UPPER", sequelize.col("User.Nickname")),
              "LIKE",
              `%${Query.toUpperCase()}%`,
            ), // Author contains keyword
          ],
        },
        order: [["views", "DESC"]], // 按照阅读量降序排列
        include: [
          {
            model: User,
            attributes: ["Nickname"], // 不返回中间表的其他属性
          },
          {
            model: Tags, // 关联中间表
            attributes: ["TagName"], // 不返回中间表的其他属性
          },
          {
            model: Like, // 关联中间表
            as: "Likes",
            attributes: ["LikeID"], // 不返回中间表的其他属性
          },
        ],
      };
      const posts = await Posts.findAll(queryOptions);
      res.json(posts);
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  }
}

module.exports = new PostController();
