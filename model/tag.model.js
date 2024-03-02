const { DataTypes } = require('sequelize')
const sequelize = require('../db/seq')
const Tag = sequelize.define(
  'Tag',
  {
    // 标签模型的字段定义
    TagID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '标签ID，主键',
    },
    TagName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '标签名称，唯一',
    },
    TagAlias: {
      type: DataTypes.STRING,
      comment: '标签别名',
    },
    TagDescription: {
      type: DataTypes.TEXT,
      comment: '标签描述',
    },
  },
  {
    tableName: 'tag', // 可以指定表名
    timestamps: false, // 不自动添加 createdAt 和 updatedAt 字段
  },
)

module.exports = Tag
