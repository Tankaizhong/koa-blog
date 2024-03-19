//管理
const express = require("express");
const { addTag } = require("../controller/admin.control");
const { validateTagName } = require("../middleware/admin.middleware");
const router = express.Router({
  prefix: "/admin",
});
//管理员添加tag
router.post("/addTag", validateTagName, addTag);
module.exports = router;
