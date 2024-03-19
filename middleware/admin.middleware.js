//验证tagName非空
const validateTagName = async (req, res, next) => {
  const { TagName } = req.body;
  // console.log(TagName, "TagName111111111111")
  if (!TagName || TagName.trim() === "") {
    return res.status(400).json({ error: "TagName不能为空" });
  }

  await next();
};

module.exports = {
  validateTagName,
};
