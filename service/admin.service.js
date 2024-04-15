const {
  Comments,
  Posts,
  User,
  Categories,
  Tags,
} = require("../db/associations");
class AdminService {
  async findTagByTagName({ TagName }) {
    console.log(TagName, "TagName");
    try {
      // 查询标签
      const tag = await Tags.findOne({
        where: {
          TagName,
        },
      });

      return tag;
    } catch (error) {
      console.error("查找标签时出错", error);
      throw error;
    }
  }

  async createTag({ TagName, tagAlias: TagAlias, tagDescription }) {
    // console.log(TagName, "TagName222222222");
    try {
      // 创建新标签
      const tag = await Tags.create({
        TagName: TagName,
        TagAlias: TagAlias,
        TagDescription: tagDescription,
      });

      return tag;
    } catch (error) {
      console.error("添加标签失败", error);
      throw error;
    }
  }

  async findCategory(CategoryName) {
    try {
      const category = await Categories.findOne({
        where: { CategoryName: CategoryName },
      });
      return category;
    } catch (error) {
      console.error("Error finding category:", error);
      throw error;
    }
  }

  async createCategory({
    CategoryName,
    CategoryAlias,
    CategoryDescription,
    ParentCategoryID,
  }) {
    try {
      // 创建分类
      const category = await Categories.create({
        CategoryName,
        CategoryAlias,
        CategoryDescription,
        ParentCategoryID,
      });
      console.log(category);
    } catch (error) {
      // 捕获错误并将其传递给全局错误处理中间件
      console.log(error);
      next(error);
    }
  }

  async fetchAllUsers() {
    try {
      // 使用 Sequelize 查询获取所有用户数据
      const users = await User.findAll();
      return users; // 返回查询结果
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error; // 抛出错误
    }
  }

  async addUser(user) {
    try {
      // 使用 Sequelize 创建新用户
      const newUser = await User.create(user);
      return newUser; // 返回新创建的用户
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // 抛出错误
    }
  }

  async getUser(user) {
    try {
      // 构建查询条件对象
      const whereClause = {};
      for (const key in user) {
        if (user.hasOwnProperty(key)) {
          whereClause[key] = user[key];
        }
      }
      console.log(whereClause, "whereClause");
      // 执行查询
      const foundUser = await User.findOne({ where: whereClause });
      return foundUser;
    } catch (error) {
      console.error("Error querying user:", error);
      throw error;
    }
  }

  //统计
  async getUserCount() {
    try {
      const count = await User.count();
      return count;
    } catch (error) {
      throw error;
    }
  }

  async getPostCount() {
    try {
      const count = await Posts.count();
      return count;
    } catch (error) {
      throw error;
    }
  }

  async getCommentCount() {
    try {
      const count = await Comments.count();
      return count;
    } catch (error) {
      throw error;
    }
  }

  async getTotalViews() {
    try {
      const posts = await Posts.findAll();
      let totalViews = 0;
      posts.forEach((post) => {
        totalViews += post.Views;
      });
      return totalViews;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdminService();
