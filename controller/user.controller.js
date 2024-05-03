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
const { PROJECT_PORT } = require("../constant/config");
const { User } = require("../db/associations");
const fs = require("fs");
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
      const {UserID} = req.body; // 假设用户 ID 存在于请求的参数中
      // console.log('11111111111111111',user)
      const data = await getPostList(UserID); // 调用 getPostList 函数获取用户文章列表
      res.json({ success: true, data: data });
    } catch (error) {
      console.error("获取用户文章列表失败", error);
      res.status(500).json({ success: false, message: "获取用户文章列表失败" });
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      if (req.file) {
        const newAvatarPath = req.file.path; // 获取新上传头像的路径
        const { UserID } = req.body.user;

        // 获取用户旧头像路径
        const user = await User.findByPk(UserID);

        const oldAvatarPath = user.dataValues.Avatar;
        // console.log(oldAvatarPath)
        // 更新用户头像信息
        await user.update({
          Avatar: `http://localhost:${PROJECT_PORT}/${req.file.filename}`,
        });

        // 删除旧头像文件
        if (oldAvatarPath) {
          const avatarFileName = oldAvatarPath.substring(
            oldAvatarPath.lastIndexOf("/") + 1,
          );
          const localAvatarPath = `D:\\User\\GP\\koa-blog\\uploads\\${avatarFileName}`;
          fs.unlinkSync(localAvatarPath);
          console.log("旧头像文件删除成功:", localAvatarPath);
        }

        // 返回上传成功的响应
        res.json({
          success: true,
          message: "头像上传成功",
          imageUrl: `http://localhost:${PROJECT_PORT}/${req.file.filename}`,
        });
      } else {
        // 如果没有上传文件，则返回上传失败的响应
        res.status(400).json({ success: false, message: "未上传文件" });
      }
    } catch (error) {
      console.error("上传头像失败:", error);
      res.status(500).json({ success: false, message: "上传头像失败，请重试" });
    }
  }

  async updateUser(req, res, next) {
    try {
      // 从请求体中获取需要更新的用户信息
      const { Username } = req.body.user;
      const updateFields = req.body.updateInfor;
      // console.log(updateFields)
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
