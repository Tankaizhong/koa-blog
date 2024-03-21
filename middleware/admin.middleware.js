const {findCategory} = require("../service/admin.service")
//验证tagName非空
const validateTagName = async (req, res, next) => {
  const {TagName} = req.body;
  // console.log(TagName, "TagName111111111111")
  if (!TagName || TagName.trim() === "") {
    return res.status(400).json({error: "TagName不能为空"});
  }
  await next();
};
//验证
const validateCategoryName = async (req, res, next) => {
  const {CategoryName} = req.body;
  if (!CategoryName || CategoryName.trim() === "") {
    return res.status(400).json({error: "CategoryName不能为空"});
  }
  const result = await findCategory(CategoryName);
  if (result) {
    return res.status(400).json({error: "CategoryName重复"});
  }
  await next();
};

module.exports = {
  validateTagName,
  validateCategoryName
};
