//文章中间件

const {
  postContentError,
  postDuplicateError,
  serverError,
  postTagError,
} = require("../constant/error.type");
const { Post } = require("../model/posts.model");
const {
  findPostByUserID,
  findUserPostsByTitle,
} = require("../service/post.service");
/**
 * 文章内容验证中间件
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
const validatePost = async (req, res, next) => {
  const { Title, Content, TagName } = req.body;
  if (!Title || !Content || !TagName) {
    //返回错误
    if (!Title || !Content) res.status(400).json(postContentError);
    else res.status(400).json(postTagError);
    return;
  }
  // 执行下一个中间件
  await next();
};

/**
 * 判断文章是否重复
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const checkDuplicateArticle = async (req, res, next) => {
  try {
    const {
      user: { UserID },
      Title,
    } = req.body;
    // 查询数据库，检查是否存在相同用户ID和标题的文章
    const existingArticle = await findUserPostsByTitle({ UserID, Title });
    if (existingArticle) {
      //文章重复错误码
      return res.status(400).json(postDuplicateError);
    }
    // 如果没有重复文章，继续下一个中间件或路由处理
    next();
  } catch (error) {
    console.error("检查文章重复时出错", error);
    res.status(500).json(serverError);
  }
};

module.exports = {
  validatePost,
  checkDuplicateArticle,
};
