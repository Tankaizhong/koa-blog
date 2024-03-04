const jwt = require("jsonwebtoken");
const { getUserInfo } = require("../service/user.service");
const { createUser } = require("../service/user.service");
const {
  userSuccessReg,
  userSuccessLogin,
} = require("../constant/success.type");

// 导入createUser
const { JWT_SECRET } = require("../config/config.default");

class UserController {
  /**
   * 登陆
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  async login(req, res, next) {
    const { Username } = req.body;
    // 1. 获取用户信息(在token的payload中, 记录id, Username, is_admin)
    try {
      // 从返回结果对象中剔除Password属性, 将剩下的属性放到res对象
      const { Password, ...result } = await getUserInfo({ Username });
      // 2. 返回结果
      res.status(200).json({
        ...userSuccessLogin,
        result: {
          ...result,
          token: jwt.sign(result, JWT_SECRET, { expiresIn: "1d" }),
        },
      });
    } catch (err) {
      console.error("用户登录失败", err);
      res.status(500).json(err);
      return;
    }
  }

  /**
   * 用户注册
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async register(req, res, next) {
    // 1. 获取数据
    const { Username, Password } = req.body;
    // 2. 操作数据库
    try {
      const result = await createUser(Username, Password);

      // 3. 返回结果
      res.status(200).json({
        ...userSuccessReg,
        result: {
          UserID: result.UserID,
          Username: result.Username,
        },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = new UserController();
