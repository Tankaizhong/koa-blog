const jwt = require("jsonwebtoken");
const {
  createUser,
  publishArticle,
  getUserInfo,
  fetchCategoriesList,
  getPostList
} = require("../service/user.service");
const {
  userSuccessReg,
  userSuccessLogin,
  userSuccessPublish,
} = require("../constant/success.type");

// 导入createUser
const {JWT_SECRET, JWT_EXPIRED} = require("../config/config.default");
const {postPublishError} = require("../constant/error.type");

class UserController {
  /**
   * 登陆
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  async login(req, res, next) {
    const {Username} = req.body;
    // 1. 获取用户信息(在token的payload中, 记录id, Username, is_admin)
    try {
      // 从返回结果对象中剔除Password属性, 将剩下的属性放到res对象
      const {Password, ...result} = await getUserInfo({Username});
      // 2. 返回结果
      res.status(200).json({
        ...userSuccessLogin,
        result: {
          ...result,
          token: jwt.sign(result, JWT_SECRET, {expiresIn: JWT_EXPIRED}),
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
    const {Username, Password} = req.body;
    try {
      const result = await createUser(Username, Password);
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

  async fetchCategorieslist(req, res, next) {
    const data = await fetchCategoriesList(); // 替换为实际的数据获取函数
    res.json({success: true, data: data});
  }

  async  fetchPostList(req, res, next) {
    try {
      // 假设您的 getPostList 函数接受一个用户 ID 参数
      // 如果您的函数签名不同，请适当修改参数
      const user = req.body.user; // 假设用户 ID 存在于请求的参数中
      // console.log('11111111111111111',user)
      const data = await getPostList(user.UserID); // 调用 getPostList 函数获取用户文章列表
      res.json({ success: true, data: data });
    } catch (error) {
      console.error('获取用户文章列表失败', error);
      res.status(500).json({ success: false, message: '获取用户文章列表失败' });
    }
  }



}

module.exports = new UserController();
