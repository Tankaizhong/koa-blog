const { DataTypes } = require('sequelize')
const sequelize = require('../db/seq')
const Posts = require('./posts.model')
const Categories = require('./categories.model')

const PostCategory = sequelize.define(
  'PostCategory',
  {
    PostID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: 'post-categories', // 可以指定表名
    timestamps: true, // 不自动添加 createdAt 和 updatedAt 字段
  },
)

PostCategory.belongsTo(Posts, { foreignKey: 'PostID', onDelete: 'CASCADE' })
PostCategory.belongsTo(Categories, {
  foreignKey: 'CategoryID',
  onDelete: 'CASCADE',
})

Posts.belongsToMany(Categories, {
  through: PostCategory,
  foreignKey: 'PostID',
  otherKey: 'CategoryID',
})
Categories.belongsToMany(Posts, {
  through: PostCategory,
  foreignKey: 'CategoryID',
  otherKey: 'PostID',
})

module.exports = PostCategory
