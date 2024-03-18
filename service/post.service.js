const Posts = require("../model/posts.model");
const User = require("../model/user.model");

class PostService {
  /**
   * 查找文章
   * @param {*} userID 用户ID
   * @param {*} title  标题
   */
  async findPostByUserID({UserID, Title}) {
    try {
      // 查询数据库，查找符合条件的文章
      const posts = await Posts.findAll({
        where: {
          '$User.UserID$': UserID,
        },
        include: [
          {
            model: User, // 关联的模型是 User
            attributes: [], // 指定要查询的用户模型的属性，或者不指定以获取全部属性
            as: 'User', // 关联的别名，与查询条件中的 '$User.UserID$' 对应
          },
        ],
      });
      // 如果找到文章，返回该文章；否则返回
      if (!posts) {
        return null;
      }
      console.log(posts, "posts.dataValues");
      return posts.map((post) => post.dataValues);
    } catch
        (error) {
      // 处理查询过程中的错误
      console.error("查找文章时出错", error);
      throw error; // 或者根据实际情况进行错误处理
    }
  }

  /**
   * 文章发布
   * @param {*} param0
   */
  async publishArticle({Title, Content, user: {UserID: UserID}}) {
    try {
      const newPost = await Posts.create({
        Title,
        Content,
        UserID,
        // 其他字段...
        Likes: 0,
        Replies: 0,
        Views: 0,
      });
      return newPost.dataValues;
    } catch (error) {
      console.error("发布文章失败", error);
      throw error;
    }
  }

  /**
   * 更新文章
   * @param {*} postID 文章ID
   * @param {*} updatedData 更新的数据
   */
  async updatePost({PostID, updatedData}) {
    try {
      const [rowsAffected, [updatedPost]] = await Posts.update(updatedData, {
        where: {
          PostID,
        },
        returning: true,
      });
      if (rowsAffected === 0) {
        return null;
      }
      return updatedPost.dataValues;
    } catch (error) {
      console.error("更新文章失败", error);
      throw error;
    }
  }

  //判断是否重复发布文章
  async findUserPostsByTitle({UserID, Title}) {
    try {
      const existingArticle = await Posts.findOne({
        where: {
          Title,
        },
        include: [
          {
            model: User, // 关联的模型是 User
            attributes: ['UserID'], // 指定要查询的用户模型的属性
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
}

module
    .exports = new PostService();