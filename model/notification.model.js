const { DataTypes } = require("sequelize");
const sequelize = require("../db/seq");

const NotificationModel = sequelize.define("Notification", {
  NotificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: "通知ID，主键",
  },
  TargetType: {
    type: DataTypes.ENUM("Post", "Comment"),
    allowNull: false,
    comment: "通知目标类型：文章或评论",
  },
  TargetID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "通知目标ID",
  },
  Content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: "通知内容",
  },
  IsRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // 默认值为未读
    comment: "是否已读",
  },
});

module.exports = NotificationModel;
