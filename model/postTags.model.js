// models/PostTags.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/seq");
const Post = require("./posts.model");
const Tag = require("./tags.model");
//博文与分类的多对多
const PostTags = sequelize.define(
  "PostTags",
  {
    // PostTags 模型的字段定义
    PostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "博文ID，外键关联到 Posts(PostID)",
    },
    TagID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "标签ID，外键关联到 Tags(TagID)",
    },
  },
  {
    tableName: "Post-Tags", // 可以指定表名
    timestamps: true, // 不自动添加 createdAt 和 updatedAt 字段
  },
);

module.exports = PostTags;
