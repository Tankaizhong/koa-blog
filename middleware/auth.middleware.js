const { invalidToken, missingToken } = require("../constant/error.type");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");

/**
 * token验证
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json(missingToken);
    return;
  }
  let result; // 声明 result 变量
  try {
    result = jwt.verify(token, JWT_SECRET);
    // console.log("token验证成功", result);
    req.body.user = result;
  } catch (error) {
    console.log("token验证失败", error);
    res.status(401).json({ ...invalidToken, ...error });
    return;
  }
  await next();
};
module.exports = {
  verifyToken,
};
