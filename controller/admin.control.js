const {findTagByTagName, createTag, createCategory} = require("../service/admin.service");

class AdminControl {
  async addTag(req, res, next) {
    const {TagName, TagAlias, tagDescription} = req.body;
    try {
      // 检查标签是否已存在
      const existingTag = await findTagByTagName({TagName});
      if (existingTag) {
        return res.status(400).json({error: "标签已存在"});
      }
      // 创建新标签
      const tag = await createTag({TagName, TagAlias, tagDescription});
      return res.status(200).json(tag);
    } catch (error) {
      console.error("添加标签失败", error);
      throw error;
    }
  }


  async addCategory(req, res, next) {
    try {
      // 创建分类
      const category = await createCategory(req.body);

      // 返回创建的分类信息
      res.status(200).json({
        message: 'Category created successfully',
        category: category
      });
    } catch (error) {
      // 捕获错误并将其传递给全局错误处理中间件
      next(error);
    }
  }
}

module.exports = new AdminControl();
