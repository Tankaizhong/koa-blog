// 1. 导入seq的连接
const { DataTypes } = require("sequelize");
const seq = require("../db/seq");
// 定义 Users 模型
const Users = seq.define(
  "Users",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "用户ID，主键",
    },
    UserIP: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "用户IP",
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户名",
    },
    Nickname: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "用户昵称",
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户密码",
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "用户邮箱",
    },
    Avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "用户头像",
    },
    RegistrationTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "注册时间",
    },
    Birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "用户生日",
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "用户年龄",
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "用户手机号",
    },
    Admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "是否为管理员, 0: 不是管理员(默认); 1: 是管理员",
    },
  },
  {
    tableName: "Users", // 可以指定表名
    timestamps: true, // 不自动添加 createdAt 和 updatedAt 字段
  },
);

module.exports = Users;
