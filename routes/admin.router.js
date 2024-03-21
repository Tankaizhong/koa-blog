//管理
const express = require("express");
const {addTag, addCategory} = require("../controller/admin.control");
const {validateTagName, validateCategoryName} = require("../middleware/admin.middleware");
const router = express.Router({
  prefix: "/admin",
});
//管理员添加tag
router.post("/addTag", validateTagName, addTag);
//管理员添加CategoryName
router.post("/addCategory", validateCategoryName, addCategory);
//
module.exports = router;
