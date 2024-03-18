const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");
const {
  userFormateError,
  userAlreadyExited,
  userRegisterError,
  userDoesNotExist,
  userLoginError,
  invalidPassword,
  invalidToken,
} = require("../constant/error.type");

const { getUserInfo } = require("../service/user.service");
/**
 * 密码加密
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const crpytPassword = async (req, res, next) => {
  const { Password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  // hash保存的是 密文
  const hash = bcrypt.hashSync(Password, salt);
  req.body.Password = hash;
  console.log("密码加密成功", req);
  await next();
};

/**
 * //密码用户名判空验证
 * @param {Promise} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const userValidator = async (req, res, next) => {
  const { Username, Password } = req.body;
  // console.log(Username, Password);
  // 合法性
  if (!Username || !Password) {
    res.status(400).json(userFormateError);
    return;
  }
  await next();
};
/**
 * 用户名是否可用验证
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyUser = async (req, res, next) => {
  const { Username } = req.body;
  try {
    const result = await getUserInfo({ Username });
    if (result) {
      console.error("用户名已经存在", { Username });
      res.status(409).json(userAlreadyExited);
      return;
    }
  } catch (err) {
    console.error("获取用户信息错误", err);
    res.status(500).json({ ...userRegisterError, ...err });
    return;
  }
  await next();
};
/**
 * 登陆验证,密码校验,用户是否存在
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyLogin = async (req, res, next) => {
  // 1. 判断用户是否存在(不存在:报错)
  const { Username, Password } = req.body;
  try {
    const result = await getUserInfo({ Username });
    if (!result) {
      console.error("用户名不存在", { Username });
      res.status(400).json(userDoesNotExist);
      return;
    }
    //2.判断密码是否对
    console.log(Password, result.Password);
    if (!bcrypt.compareSync(Password, result.Password)) {
      res.status(400).json(invalidPassword);
      return;
    }
  } catch (error) {
    res.status(500).json({ ...userLoginError, result: error });
    return;
  }
  await next();
};

/**
 * token验证
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

module.exports = {
  userValidator,
  verifyUser,
  verifyLogin,
  crpytPassword,
};
