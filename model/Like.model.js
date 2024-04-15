const { DataTypes } = require("sequelize");
const sequelize = require("../db/seq");

const Like = sequelize.define(
  "Like",
  {
    LikeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "点赞ID，主键",
    },
    // 其他点赞字段
  },
  {
    tableName: "like", // 指定表名
    timestamps: true, // 不自动添加 createdAt 和 updatedAt 字段
  },
);

module.exports = Like;
