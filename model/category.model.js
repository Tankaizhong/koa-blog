// 1. 导入seq的连接
const { DataTypes } = require("sequelize");
const seq = require("../db/seq");

const Category = sequelize.define("Category", {
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
});

// 建立与自身的关联关系，表示父分类ID
Category.belongsTo(Category, {
  foreignKey: "ParentCategoryID",
  as: "ParentCategory",
  onDelete: "CASCADE",
});

module.exports = Category;
