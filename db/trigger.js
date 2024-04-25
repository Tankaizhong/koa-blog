// 在点赞创建后触发通知的生成
const { Posts, Comments, User, Like, Notification } = require("./associations");

Like.afterCreate(async (like, options) => {
  try {
    // 获取被点赞的对象的相关信息，比如被点赞的文章或评论
    const { PostID, CommentID } = like;
    let target;

    if (PostID) {
      // 如果是点赞的是文章
      target = await Posts.findByPk(PostID, {
        include: [{ model: User, as: "author" }],
      });
    } else if (CommentID) {
      // 如果是点赞的是评论
      target = await Comments.findByPk(CommentID, {
        include: [{ model: User }],
      });
    }

    if (!target) {
      console.error("无法找到点赞对象");
      return;
    }

    const targetType = PostID ? "Post" : "Comment";
    const targetID = target.PostID || target.CommentID;
    let notificationContent = `用户 ${like.UserID} 给您的 ${
      targetType === "Post" ? "文章" : "评论"
    } 点了赞`;
    // 添加文章标题或评论内容到通知内容中
    let targetContent = targetType === "Post" ? target.Title : target.Content;
    console.log(targetContent, "9999999999999");
    if (targetContent.length > 20) {
      notificationContent += ": " + targetContent.slice(0, 20) + "...";
    } else {
      notificationContent += ": " + targetContent;
    }

    // 创建通知并保存到数据库
    await Notification.create({
      TargetType: targetType,
      TargetID: targetID,
      Content: notificationContent,
      UserID: like.UserID,
    });

    // 这里可以执行保存通知到数据库或发送通知给用户等逻辑
    console.log("生成通知:", notificationContent);
  } catch (error) {
    console.error("触发通知生成失败:", error);
  }
});
