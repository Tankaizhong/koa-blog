// models/comment.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db/seq"); // 假设你有一个数据库配置文件
const User = require("./user.model"); // 导入 User 模型
const Posts = require("./posts.model"); // 导入 Post 模型
const Comment = sequelize.define(
  "Comment",
  {
    // 评论模型的字段定义
    CommentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "评论ID，主键",
    },
    CommentDate: {
      type: DataTypes.DATE,
      comment: "评论日期",
    },
    Content: {
      type: DataTypes.TEXT,
      comment: "评论内容",
    },
  },
  {
    tableName: "Comments", // 可以指定表名
    timestamps: true, // 不自动添加 createdAt 和 updatedAt 字段
  },
);

module.exports = Comment;
