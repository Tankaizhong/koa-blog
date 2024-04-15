// 1. 导入seq的连接
const { DataTypes } = require("sequelize");
const sequelize = require("../db/seq");
const User = require("./user.model");
const Tags = require("./tags.model");
// 定义 Posts 模型
const Posts = sequelize.define(
  "Posts",
  {
    PostID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "博文ID，主键",
    },
    PostDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "博文发布日期",
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "博文标题",
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "博文内容",
    },
    Replies: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "回复数",
    },
    Views: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "浏览量",
    },
  },
  {
    tableName: "Posts", // 可以指定表名
    timestamps: true, // 不自动添加 createdAt 和 updatedAt 字段
  },
);

module.exports = Posts; // 导出 Posts 模型，以便在其他文件中使用
