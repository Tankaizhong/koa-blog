const sequelize = require("../db/seq");
const Posts = require("../model/posts.model");
const Tags = require("../model/tags.model");
const PostTags = require("../model/postTags.model");
const PostCategories = require("../model/postCategories.model");
const Categories = require("../model/categories.model");

class TagsService {
  constructor() {
    // this.updateTags = this.updateTags.bind(this);
  }

  // 更新标签和分类的逻辑
  async updateTagsAndCategories(postID, TagNames, CategoryNames) {
    // 如果tagNames为空，则设置默认值为['defaultTag']
    console.log(
      postID,
      "postID",
      TagNames,
      "tagNames",
      CategoryNames,
      "categoryNames",
    );
    if (!TagNames || TagNames.length === 0) {
      TagNames = ["技术"];
    }

    // 如果categoryNames为空，则设置默认值为['defaultCategory']
    if (!CategoryNames || CategoryNames.length === 0) {
      CategoryNames = ["技术"];
    }

    let transaction;
    try {
      // 开启事务
      transaction = await sequelize.transaction({ timeout: 30000 });
      // console.log(this, "11111111111111111111");
      // 更新标签
      //const tagIDs = await this.updateTags(postID, TagNames, transaction);

      // 更新分类
      // const categoryIDs = await this.updateCategories(
      //     postID,
      //     CategoryNames,
      //     transaction,
      // );

      // 提交事务
      // await transaction.commit();

      // 返回标签和分类的ID
      // return {tagIDs, categoryIDs};
    } catch (error) {
      // 回滚事务
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async updateTags(postID, tagNames, transaction) {
    const tagIDs = [];
    for (const tagName of tagNames) {
      let tag = await Tags.findOne({
        where: { TagName: tagName },
        transaction,
      });

      if (!tag) {
        tag = await Tags.create({ TagName: tagName }, { transaction });
      }
      tagIDs.push(tag.TagID);
      // console.log(tag.TagID, "tag");
    }
    return tagIDs;
  }

  async updateCategories(postID, CategoryNames, transaction) {
    const categoryIDs = [];
    for (const categoryName of CategoryNames) {
      let category = await Categories.findOne({
        where: { CategoryName: categoryName },
        transaction,
      });
      if (!category) {
        category = await Categories.create(
          { CategoryName: categoryName },
          { transaction },
        );
      }
      categoryIDs.push(category.CategoryID);
    }
    return categoryIDs;
  }
}

module.exports = new TagsService();
