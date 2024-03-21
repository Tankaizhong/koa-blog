const Tags = require("../model/tags.model");
const Categories = require("../model/categories.model");

class AdminService {
  async findTagByTagName({TagName}) {
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

  async createTag({TagName, tagAlias: TagAlias, tagDescription}) {
    // console.log(TagName, "TagName222222222");
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

  async findCategory(CategoryName) {
    try {
      const category = await Categories.findOne({
        where: {CategoryName: CategoryName}
      });
      return category;
    } catch (error) {
      console.error("Error finding category:", error);
      throw error;
    }
  }

  async createCategory({CategoryName, CategoryAlias, CategoryDescription, ParentCategoryID}) {
    try {

      // 创建分类
      const category = await Categories.create({
        CategoryName,
        CategoryAlias,
        CategoryDescription,
        ParentCategoryID,
      });

      // 返回创建的分类信息
      // res.status(201).json({
      //   message: 'Category created successfully',
      //   category: category
      // });
      console.log(category)
    } catch (error) {
      // 捕获错误并将其传递给全局错误处理中间件
      console.log(error)
      next(error);
    }

  }
}


module.exports = new AdminService();
