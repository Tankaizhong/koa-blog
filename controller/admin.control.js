const { findTagByTagName, createTag } = require("../service/admin.service");

class AdminControl {
  async addTag(req, res, next) {
    const { TagName, TagAlias, tagDescription } = req.body;
    try {
      // 检查标签是否已存在
      const existingTag = await findTagByTagName({ TagName });
      if (existingTag) {
        return res.status(400).json({ error: "标签已存在" });
      }
      // 创建新标签
      const tag = await createTag({ TagName, TagAlias, tagDescription });
      return res.status(200).json(tag);
    } catch (error) {
      console.error("添加标签失败", error);
      throw error;
    }
  }
}

module.exports = new AdminControl();
