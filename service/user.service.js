const User = require("../model/user.model");
const Post = require("../model/posts.model");
class UserService {
  /**
   * 创建用户
   * @param {*} Username
   * @param {*} Password
   * @returns
   */
  async createUser(Username, Password) {
    // 插入数据
    // await表达式: promise对象的值
    const res = await User.create({ Username, Password });
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
      attributes: ["UserID", "Username", "Password", "Admin"],
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
}

module.exports = new UserService();
