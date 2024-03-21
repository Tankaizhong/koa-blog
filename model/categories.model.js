// 1. 导入seq的连接
const { DataTypes } = require("sequelize");
const sequelize = require("../db/seq");
const User = require("./user.model");
//分类表，存储博文分类信息
const Category = sequelize.define(
  "Category",
  {
    // 分类模型的字段定义
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "分类ID，主键",
    },
    CategoryName: {
      type: DataTypes.STRING,
      comment: "分类名称",
    },
    CategoryAlias: {
      type: DataTypes.STRING,
      comment: "分类别名",
    },
    CategoryDescription: {
      type: DataTypes.TEXT,
      comment: "分类描述",
    },
    ParentCategoryID: {
      type: DataTypes.INTEGER,
      comment: "父分类ID，外键关联到自身",
    },
  },
  {
    tableName: "Categories", // 可以指定表名
    timestamps: true, // 不自动添加 createdAt 和 updatedAt 字段
  },
);

// 建立与自身的关联关系，表示父分类ID
Category.belongsTo(Category, {
  foreignKey: "ParentCategoryID",
  as: "ParentCategory",
  onDelete: "CASCADE",
});
Category.belongsTo(User, { foreignKey: 'UserID' }); // 建立外键关系，每个分类属于一个用户

module.exports = Category;
