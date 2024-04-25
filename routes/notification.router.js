const express = require("express");
const router = express.Router({
  prefix: "/notifications",
});
const { Notification, User } = require("../db/associations");
const { Op } = require("@sequelize/core");

// 轮询通知的 API
router.post("/fetchNotification", async (req, res) => {
  const { TargetID } = req.body;
  // console.log(TargetID)
  try {
    // 查询未读通知
    const notifications = await Notification.findAll({
      where: { UserID: { [Op.ne]: TargetID }, TargetID },
      include: [
        {
          model: User,
          attributes: ["UserID", "Username", "Nickname", "Avatar"],
        },
      ], // 如果需要用户信息，可以包含 User 模型
    });

    res.json({ notifications });
  } catch (error) {
    console.error("Error polling notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// 标记为已读
router.post("/:NotificationID/markAsRead", async (req, res) => {
  const { NotificationID } = req.params;
  // console.log(req.params)
  try {
    // 根据 notificationId 将通知标记为已读，具体实现根据您的数据库结构来操作
    // 示例中假设您的通知模型是 NotificationModel，且有一个名为 markAsRead 的方法用于标记通知为已读
    const notification = await Notification.findByPk(NotificationID);
    if (notification) {
      // 更新通知的状态为已读
      await notification.update({ IsRead: true });
      res.status(200).send("Notification marked as read successfully");
    } else {
      res.status(404).send("Notification not found");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
