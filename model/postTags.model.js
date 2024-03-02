// models/postTag.model.js
const { DataTypes } = require('sequelize')
const sequelize = require('../db/seq')
const Post = require('./posts.model')
const Tag = require('./tag.model')
//博文与分类的多对多
const PostTag = sequelize.define(
  'PostTag',
  {
    // PostTags 模型的字段定义
    PostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: '博文ID，外键关联到 Posts(PostID)',
    },
    TagID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: '标签ID，外键关联到 Tags(TagID)',
    },
  },
  {
    tableName: 'PostTags', // 可以指定表名
    timestamps: false, // 不自动添加 createdAt 和 updatedAt 字段
  },
)

// 建立与 Posts 模型的关联关系
PostTag.belongsTo(Post, { foreignKey: 'PostID', onDelete: 'CASCADE' })

// 建立与 Tags 模型的关联关系
PostTag.belongsTo(Tag, { foreignKey: 'TagID', onDelete: 'CASCADE' })

Post.belongsToMany(Tag, {
  through: PostTag,
  foreignKey: 'PostID',
  otherKey: 'TagID',
})
Tag.belongsToMany(Post, {
  through: PostTag,
  foreignKey: 'TagID',
  otherKey: 'PostID',
})

module.exports = PostTag
