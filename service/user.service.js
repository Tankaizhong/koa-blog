const User = require("../model/user.model");
const Post = require("../model/posts.model");
const Categories = require("../model/categories.model");

class UserService {
  /**
   * 创建用户
   * @param {*} Username
   * @param {*} Password
   * @returns
   */
  async createUser(userData) {
    // 插入数据
    // await表达式: promise对象的值
    const res = await User.create(userData);
    return res.dataValues;
  }

  /**
   * 获取用户信息
   * @param {*} param0
   * @returns
   */
  async getUserInfo({ UserID, Username, Password, Admin }) {
    const whereOpt = {};
    UserID && Object.assign(whereOpt, { UserID });
    Username && Object.assign(whereOpt, { Username });
    Password && Object.assign(whereOpt, { Password });
    Admin && Object.assign(whereOpt, { Admin });
    const res = await User.findOne({
      attributes: [
        "UserID",
        "Username",
        "Password",
        "Admin",
        "Nickname",
        "Avatar",
        "Email",
        "PhoneNumber",
        "LastLoginTime",
        "LoginCount",
        "CreatedAt",
        "UpdatedAt",
      ],
      where: whereOpt,
    });
    return res ? res.dataValues : null;
  }

  /**
   * 根据ID更新用户信息
   * @param {用户信息结构体} param0
   * @returns
   */
  async updateByUserID({ UserID, Username, Password, Admin }) {
    const whereOpt = { UserID };
    const newUser = {};

    Username && Object.assign(newUser, { Username });
    Password && Object.assign(newUser, { Password });
    Admin && Object.assign(newUser, { Admin });

    const res = await User.update(newUser, { where: whereOpt });
    // console.log(res)
    return res[0] > 0 ? true : false;
  }

  async fetchCategoriesList() {
    try {
      // 使用模型的 findAll 方法从数据库中获取所有分类数据
      const categories = await Categories.findAll();
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getPostList(userID) {
    try {
      // 假设您的 Post 模型定义为 Post，并且与 User 模型存在一对多关系
      // 假设您的 User 模型定义为 User，每个用户有多篇文章
      const user = await User.findByPk(userID); // 根据用户 ID 查询用户信息
      if (!user) {
        throw new Error("用户不存在");
      }

      // 假设您的文章模型为 Post，与用户模型存在外键关系，用于关联用户的文章
      const userPosts = await Post.findAll({
        where: { UserID: userID }, // 根据用户 ID 查询该用户的文章
        include: [
          {
            model: User,
            attributes: [],
          },
        ], // 关联用户信息，如果需要的话
        order: [["createdAt", "DESC"]], // 根据创建时间降序排列文章
        // attributes: ['Title','Views','Likes','Replies'],
      });
      return userPosts; // 返回用户的文章列表数据
    } catch (error) {
      console.error("获取用户文章列表失败", error);
      throw error; // 抛出错误，以便在调用方处理错误
    }
  }

  async updateUserInfo(updateData) {
    const { Username, ...updateFields } = updateData;
    // console.log(Username, updateFields, "11111111111111111");
    try {
      let user = await User.findOne({ where: { Username } });
      // console.log(user,'11111111111111')
      if (!user) {
        throw new Error("User not found");
      }
      await user.update(updateFields);
      user = await User.findOne({ where: { Username } });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
