const {
  getTotalViews,
  getCommentCount,
  getPostCount,
  getUserCount,
  findTagByTagName,
  createTag,
  createCategory,
  fetchAllUsers,
  addUser,
  getUser,
} = require("../service/admin.service");

class AdminControl {
  async addTag(req, res, next) {
    const { TagName, TagAlias, tagDescription } = req.body;
    try {
      // 检查标签是否已存在
      const existingTag = await findTagByTagName({ TagName });
      if (existingTag) {
        return res.status(400).json({ error: "标签已存在" });
      }
      // 创建新标签
      const tag = await createTag({ TagName, TagAlias, tagDescription });
      return res.status(200).json(tag);
    } catch (error) {
      console.error("添加标签失败", error);
      throw error;
    }
  }

  async addCategory(req, res, next) {
    try {
      // 创建分类
      const category = await createCategory(req.body);
      // 返回创建的分类信息
      res.status(200).json({
        message: "Category created successfully",
        category: category,
      });
    } catch (error) {
      // 捕获错误并将其传递给全局错误处理中间件
      next(error);
    }
  }

  async fetchUsersList(req, res, next) {
    try {
      // 获取所有用户
      const users = await fetchAllUsers();
      // 返回用户信息
      res.status(200).json(users);
    } catch (error) {
      // 捕获错误并将其传递给全局错误处理中间件
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      // 创建用户
      const user = await addUser(req.body.userInfo);
      // 返回用户信息
      res.status(200).json(user);
    } catch (error) {
      // 捕获错误并将其传递给全局错误处理中间件
      next(error);
    }
  }

  async fetchUsers(req, res, next) {
    try {
      // 创建用户
      const user = await getUser(req.body.userInfo);
      // 返回用户信息
      res.status(200).json(user);
    } catch (error) {
      // 捕获错误并将其传递给全局错误处理中间件
      next(error);
    }
  }

  async checkSuperAdmin(req, res, next) {
    try {
      // 创建用户
      // console.log(req.body.user,'11111111111111111111111111333333')
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async fetchBlogStats(req, res, next) {
    try {
      let userCount = 0;
      let postCount = 0;
      let commentCount = 0;
      let totalViews = 0;

      try {
        userCount = await getUserCount();
        postCount = await getPostCount();
        commentCount = await getCommentCount();
        totalViews = await getTotalViews();
      } catch (error) {
        console.error("Error fetching blog stats:", error);
      }

      const blogStats = {
        userCount,
        postCount,
        commentCount,
        totalViews,
      };

      res.status(200).json(blogStats);
    } catch (error) {
      console.error("Error in fetchBlogStats:", error);
      next(error);
    }
  }
}

module.exports = new AdminControl();
