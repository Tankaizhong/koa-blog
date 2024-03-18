module.exports = {
  userFormateError: {
    code: "10001",
    message: "用户名或密码为空",
    result: "",
  },
  userAlreadyExited: {
    code: "10002",
    message: "用户已经存在",
    result: "",
  },
  userRegisterError: {
    code: "10003",
    message: "用户注册错误",
    result: "",
  },
  userDoesNotExist: {
    code: "10004",
    message: "用户不存在",
    result: "",
  },
  userLoginError: {
    code: "10005",
    message: "用户登录失败",
    result: "",
  },
  invalidPassword: {
    code: "10006",
    message: "密码不匹配",
    result: "",
  },
  tokenExpiredError: {
    code: "10101",
    message: "token已过期",
    result: "",
  },
  invalidToken: {
    code: "10102",
    message: "无效的token",
    result: "",
  },
  missingToken: {
    code: "10103",
    message: "缺失token",
    result: "",
  },

  hasNotAdminPermission: {
    code: "10104",
    message: "没有管理员权限",
    result: "",
  },
  //文章
  //文章重复,请勿重复发布
  postDuplicateError: {
    code: "11001",
    message: "文章重复,请勿重复发布",
    result: "",
  },
  postContentError: {
    code: "11004",
    message: "标题或内容不能为空",
    result: "",
  },
  //文章发布失败
  postPublishError: {
    code: "11005",
    message: "文章发布失败",
    result: "",
  },
  //文章不存在
  postNotExist: {
    code: "11006",
    message: "文章不存在",
    result: "",
  },

  unSupportedFileType: {
    code: "10202",
    message: "不支持的文件格式",
    result: "",
  },
  goodsFormatError: {
    code: "10203",
    message: "商品参数格式错误",
    result: "",
  },
  publishGoodsError: {
    code: "10204",
    message: "发布商品失败",
    result: "",
  },
  invalidGoodsID: {
    code: "10205",
    message: "无效的商品id",
    result: "",
  },
  cartFormatError: {
    code: "10301",
    message: "购物车数据格式错误",
    result: "",
  },
  addrFormatError: {
    code: "10401",
    message: "地址数据格式错误",
    result: "",
  },
  orderFormatError: {
    code: "10501",
    message: "订单数据格式错误",
    result: "",
  },

  serverError: {
    code: "50001",
    message: "服务器内部错误",
    result: "",
  },
};
