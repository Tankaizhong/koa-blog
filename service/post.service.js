const sequelize = require("../db/seq");

const {
  User,
  PostCategories,
  PostTags,
  Like,
  Tags,
  Categories,
  Posts,
} = require("../db/associations");
const { updateTagsAndCategories } = require("./tag.service");

class PostService {
  /**
   * 查找文章
   * @param {*} userID 用户ID
   * @param {*} title  标题
   */
  async findPostByUserID({ UserID, Title }) {
    try {
      // 查询数据库，查找符合条件的文章
      const posts = await Posts.findAll({
        where: {
          "$User.UserID$": UserID,
        },
        include: [
          {
            model: User, // 关联的模型是 User
            attributes: [], // 指定要查询的用户模型的属性，或者不指定以获取全部属性
            as: "User", // 关联的别名，与查询条件中的 '$User.UserID$' 对应
          },
        ],
      });
      // 如果找到文章，返回该文章；否则返回
      if (!posts) {
        return null;
      }
      console.log(posts, "posts.dataValues");
      return posts.map((post) => post.dataValues);
    } catch (error) {
      // 处理查询过程中的错误
      console.error("查找文章时出错", error);
      throw error; // 或者根据实际情况进行错误处理
    }
  }

  /**
   * 文章发布
   * @param {*} param0
   */
  // 在发布文章的函数中调用更新标签和分类的逻辑
  async publishPost({
    Title,
    Content,
    user: { UserID },
    TagName,
    CategoryName,
  }) {
    let transaction;
    try {
      // 开启事务
      transaction = await sequelize.transaction();
      // 创建文章
      const post = await Posts.create(
        { Title, Content, UserID, Likes: 0, Views: 0, Replies: 0 },
        { transaction },
      );
      // 创建或获取标签，并与文章关联
      const tagIDs = await Promise.all(
        TagName.map(async (TagName) => {
          let tag = await Tags.findOne({ where: { TagName }, transaction });
          if (!tag) {
            tag = await Tags.create({ TagName }, { transaction });
          }
          await PostTags.create(
            { PostID: post.PostID, TagID: tag.TagID },
            { transaction },
          );
          return tag.TagID;
        }),
      );

      // 创建或获取分类，并与文章关联
      let categoryIDs;
      if (CategoryName) {
        let category = await Categories.findOne({
          where: { CategoryName },
          transaction,
        });
        if (!category) {
          category = await Categories.create({ CategoryName }, { transaction });
        }
        await PostCategories.create(
          { PostID: post.PostID, CategoryID: category.CategoryID },
          { transaction },
        );
        categoryIDs = category.CategoryID;
      }
      // 提交事务
      await transaction.commit();

      return { postID: post.PostID, tagIDs, categoryIDs };
    } catch (error) {
      // 回滚事务
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  //判断是否重复发布文章
  async findUserPostsByTitle({ UserID, Title }) {
    try {
      const existingArticle = await Posts.findOne({
        where: {
          Title,
        },
        include: [
          {
            model: User, // 关联的模型是 User
            attributes: ["UserID"], // 指定要查询的用户模型的属性
            where: {
              UserID,
            },
          },
        ],
      });
      return existingArticle;
    } catch (error) {
      console.error("查找文章时出错", error);
      throw error;
    }
  }

  /**
   * 查找top文章
   * @returns
   */
  async getTopPost(data) {
    const { CategoryID } = data;
    // console.log(CategoryID,'11111111111111111111')
    // const {} = data;
    try {
      // 构建查询条件
      const queryOptions = {
        order: [["views", "DESC"]], // 按照阅读量降序排列
        limit: 10, // 获取前10篇热门文章
        include: [
          {
            model: User,
            as: "author", // 指定关联的别名，以便后续访问
            attributes: ["Username"], // 不返回中间表的其他属性
          },
          {
            model: Tags, // 关联中间表
            attributes: ["TagName"], // 不返回中间表的其他属性
          },
        ],
      };

      // 判断是否存在分类ID，如果有则添加关联条件
      if (CategoryID) {
        queryOptions.include.push({
          model: Categories, // 关联中间表
          where: { CategoryID }, // 添加关联条件
          attributes: [],
        });
      }
      const topPosts = await Posts.findAll(queryOptions);

      // console.log(topPosts)
      return topPosts;
    } catch (error) {
      console.log(error);
      console.log("错误");
      throw error;
    }
  }

  /**
   * 更新文章
   * @param postID
   * @param Title
   * @param Content
   * @param TagNames
   * @param CategoryNames
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async updatePost(postID, { Title, Content, TagNames, CategoryNames }) {
    let transaction;
    try {
      // 开启事务
      transaction = await sequelize.transaction();

      // 更新文章标题和内容
      await Posts.update(
        { Title, Content },
        { where: { PostID: postID }, transaction },
      );

      // 更新文章标签和分类
      await TagsService.updateTagsAndCategories(
        postID,
        TagNames,
        CategoryNames,
        transaction,
      );

      // 提交事务
      await transaction.commit();

      return { success: true, message: "文章更新成功" };
    } catch (error) {
      // 回滚事务
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async findPostByPostID(postID) {
    // console.log(postID)
    const num = parseInt(postID.match(/\d+/)[0], 10);
    console.log(num);
    try {
      const post = await Posts.findOne({ where: { postID: num } });
      return post;
    } catch (error) {
      console.error("查找文章失败", error);
      throw error; // 将错误向上抛出
    }
  }

  //点赞
  async increaseLike(PostID) {
    // console.log(PostID, "PostID"  )
    try {
      // 根据文章 ID 查找文章
      const post = await Posts.findByPk(PostID);
      if (!post) {
        throw new Error("文章不存在");
      }
      // 更新点赞数
      post.Likes += 1;
      await post.save();
      return post; // 返回更新后的文章数据
    } catch (error) {
      console.error("增加点赞失败", error);
      throw error;
    }
  }

  async addViewToPost(PostID) {
    try {
      // 在数据库中查找对应的文章
      const post = await Posts.findByPk(PostID);
      // 如果找不到文章，则返回 null
      if (!post) {
        return null;
      }
      // 增加文章的浏览量
      post.Views += 1;
      // 保存更新后的文章
      await post.save();
      // 返回更新后的文章对象
      return post;
    } catch (error) {
      console.error("增加浏览量失败", error);
      throw error; // 将错误向上抛出
    }
  }

  async getTags() {
    try {
      const tags = await Tags.findAll({
        attributes: ["TagID", "TagName"], // 只返回 ID 和 name 字段
      });
      // console.log(tags)
      return tags;
    } catch (error) {
      console.error("获取标签列表失败", error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const categories = await Categories.findAll({
        attributes: ["CategoryID", "CategoryName"],
      });
      // console.log(categories)
      return categories;
    } catch (error) {
      console.error("获取标签列表失败", error);
      throw error;
    }
  }

  async getPostsByCategory(CategoryID) {
    try {
      const posts = await PostCategories.findAll({
        where: { CategoryID: CategoryID }, // 假设文章模型中有一个 CategoryID 字段用于存储分类 ID
        include: [
          {
            model: Posts,
            attributes: ["PostID", "Title", "Content", "CreatedAt"],
          },
        ], // 关联查询分类名称
        // 返回的文章属性列表
        order: [["CreatedAt", "DESC"]], // 按创建时间降序排列
      });
      // console.log(categories)
      return posts;
    } catch (error) {
      console.error("获取标签列表失败", error);
      throw error;
    }
  }

  //更新点赞

  async updatePostLikes(PostID) {
    try {
      // 查询指定文章的点赞数量
      const likeCount = await Like.count({
        where: {
          PostID,
        },
      });
      // 更新文章记录中的点赞数量字段
      await Posts.update(
        { Likes: likeCount },
        {
          where: {
            PostID,
          },
        },
      );
    } catch (error) {
      console.error("更新文章点赞数量失败", error);
      throw error;
    }
  }
}

module.exports = new PostService();
