// associations.js
// 导入所有模型

const User = require('../model/user.model');
const Tags = require("../model/tags.model");
const PostTags = require("../model/postTags.model");
const Posts = require("../model/posts.model");
const Categories = require("../model/categories.model");
const PostCategories = require("../model/postCategories.model");
const Comments = require("../model/comments.model");
const Like = require("../model/like.model");


// 定义关联关系
User.hasMany(Posts, {as: 'posts'});
Posts.belongsTo(User, {foreignKey: 'UserID', as: 'author'});

Posts.belongsToMany(Tags, {through: 'PostTags', as: 'tag', foreignKey: 'PostID'});
Tags.belongsToMany(Posts, {through: 'PostTags', as: 'posts'});


// 建立与 Posts 模型的关联关系
PostTags.belongsTo(Posts, {foreignKey: "PostID", onDelete: "CASCADE"});

// 建立与 Tags 模型的关联关系
PostTags.belongsTo(Tags, {foreignKey: "TagID", onDelete: "CASCADE"});

Posts.belongsToMany(Tags, {
  through: PostTags,
  foreignKey: "PostID",
  otherKey: "TagID",
});
Tags.belongsToMany(Posts, {
  through: PostTags,
  foreignKey: "TagID",
  otherKey: "PostID",
});

// 定义与 Users 模型的外键关联
Posts.belongsTo(User, {
  foreignKey: {
    name: "UserID",
    allowNull: false, // 设置为false表示UserID不能为空
  },
});


PostCategories.belongsTo(Posts, {foreignKey: "PostID", onDelete: "CASCADE"});
PostCategories.belongsTo(Categories, {
  foreignKey: "CategoryID",
  onDelete: "CASCADE",
});

Posts.belongsToMany(Categories, {
  through: PostCategories,
  foreignKey: "PostID",
  otherKey: "CategoryID",
});
Categories.belongsToMany(Posts, {
  through: PostCategories,
  foreignKey: "CategoryID",
  otherKey: "PostID",
});


// 建立与 User 模型的关联关系
Comments.belongsTo(User, {foreignKey: "UserID", onDelete: "CASCADE"});

// 建立与 Post 模型的关联关系
Comments.belongsTo(Posts, {foreignKey: "PostID", onDelete: "CASCADE"});

// 建立与自身的关联关系，表示父评论ID
Comments.belongsTo(Comments, {
  foreignKey: "ParentCommentID",
  as: "ParentComment",
  onDelete: "CASCADE",
});

// 建立与自身的关联关系，表示父分类ID
Categories.belongsTo(Categories, {
  foreignKey: "ParentCategoryID",
  as: "ParentCategory",
  onDelete: "CASCADE",
});
Categories.belongsTo(User, {foreignKey: 'UserID'}); // 建立外键关系，每个分类属于一个用户

//Like表的关系
Like.belongsTo(User, {foreignKey: 'UserID', as: 'User'});

// 建立与文章表的关联
Like.belongsTo(Posts, {foreignKey: 'PostID', as: 'Post'});

module.exports = {User, Tags, PostTags, Posts, Categories, PostCategories, Comments, Like};
