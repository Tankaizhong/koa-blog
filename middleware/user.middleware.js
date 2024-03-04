const {
  userFormateError,
  userAlreadyExited,
  userRegisterError,
} = require("../constant/err.type");

const { getUserInfo } = require("../service/user.service");
/**
 * //密码用户名判空验证
 * @param {Promise} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const userValidator = async (req, res, next) => {
  const { Username, Password } = req.body;
  console.log(Username, Password);
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

module.exports = {
  userValidator,
  verifyUser,
};
