const Tags = require("../model/tags.model");

class AdminService {
  async findTagByTagName({ TagName }) {
    console.log(TagName, "TagName");
    try {
      // 查询标签
      const tag = await Tags.findOne({
        where: {
          TagName,
        },
      });

      return tag;
    } catch (error) {
      console.error("查找标签时出错", error);
      throw error;
    }
  }

  async createTag({ TagName, tagAlias: TagAlias, tagDescription }) {
    console.log(TagName, "TagName222222222");
    try {
      // 创建新标签
      const tag = await Tags.create({
        TagName: TagName,
        TagAlias: TagAlias,
        TagDescription: tagDescription,
      });

      return tag;
    } catch (error) {
      console.error("添加标签失败", error);
      throw error;
    }
  }
}

module.exports = new AdminService();
