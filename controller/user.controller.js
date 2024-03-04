const { getUerInfo } = require("../service/user.service");
const { createUser } = require("../service/user.service");
const { userSuccessReg } = require("../constant/success.type");
// 导入createUser

class UserController {
  async login(req, res, next) {
    const { Username } = ctx.request.body;
    // 1. 获取用户信息(在token的payload中, 记录id, Username, is_admin)
    try {
      // 从返回结果对象中剔除Password属性, 将剩下的属性放到res对象
      const { Password, ...res } = await getUerInfo({ Username });
      ctx.body = {
        code: 0,
        message: "用户登录成功",
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: "1d" }),
        },
      };
    } catch (err) {
      console.error("用户登录失败", err);
    }
    next();
  }
  async register(req, res, next) {
    // 1. 获取数据
    const { Username, Password } = req.body;
    console.log(Username, Password);
    // 2. 操作数据库
    try {
      const result = await createUser(Username, Password);
      console.log(result);
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
    next();
  }
}

module.exports = new UserController();
