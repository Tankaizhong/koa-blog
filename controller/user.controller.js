const jwt = require("jsonwebtoken");
const {
  createUser,
  publishArticle,
  getUserInfo,
  updateUserInfo,
  fetchCategoriesList,
  getPostList,
} = require("../service/user.service");
const {
  userSuccessReg,
  userSuccessLogin,
  userSuccessPublish,
} = require("../constant/success.type");

// 导入createUser
const { JWT_SECRET, JWT_EXPIRED } = require("../config/config.default");
const { postPublishError } = require("../constant/error.type");
const path = require("path");

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
      const { Password, ...userInfo } = await getUserInfo({ Username });
      // console.log(userInfo)
      await updateUserInfo({
        Username,
        LastLoginTime: new Date(), // 更新登录时间
        LoginCount: userInfo.LoginCount + 1, // 更新登录次数
      });

      // 2. 返回结果
      res.status(200).json({
        ...userSuccessLogin,
        result: {
          ...userInfo,
          token: jwt.sign(userInfo, JWT_SECRET, { expiresIn: JWT_EXPIRED }),
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
    const { Username, Password } = req.body;
    try {
      const result = await createUser(req.body);
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

  async fetchCategoriesList(req, res, next) {
    const data = await fetchCategoriesList(); // 替换为实际的数据获取函数
    res.json({ success: true, data: data });
  }

  async fetchPostList(req, res, next) {
    try {
      // 假设您的 getPostList 函数接受一个用户 ID 参数
      // 如果您的函数签名不同，请适当修改参数
      const user = req.body.user; // 假设用户 ID 存在于请求的参数中
      // console.log('11111111111111111',user)
      const data = await getPostList(user.UserID); // 调用 getPostList 函数获取用户文章列表
      res.json({ success: true, data: data });
    } catch (error) {
      console.error("获取用户文章列表失败", error);
      res.status(500).json({ success: false, message: "获取用户文章列表失败" });
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      // 如果成功上传文件，则在 req.file 中会包含上传的文件信息
      if (req.file) {
        // 获取上传文件的绝对路径
        const absoluteFilePath = path.resolve(
          __dirname,
          "../uploads/",
          req.file.filename,
        );
        const result = await updateUserInfo({
          ...req.body.user,
          Avatar: absoluteFilePath,
        });
        // console.log(result)
        // 在这里执行其他逻辑，比如保存文件信息到数据库或者返回上传成功的响应
        res.json({
          success: true,
          message: "File uploaded successfully",
          absoluteFilePath,
        });
      } else {
        // 如果没有上传文件，则返回上传失败的响应
        res.status(400).json({ success: false, message: "No file uploaded" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload file" });
    }
  }

  async updateUser(req, res, next) {
    try {
      // 从请求体中获取需要更新的用户信息
      const { Username } = req.body.user;
      const updateFields = req.body.updateInfor;
      const user = await getUserInfo(req.body.user);
      const result = await updateUserInfo(updateFields);
      // 更新用户信息
      // console.log(updateFields,'1111111111111111')
      // 返回更新后的用户信息给前端
      return res.json({
        success: true,
        message: "User information updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error updating user information:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update user information" });
    }
  }
}

module.exports = new UserController();
