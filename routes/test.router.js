const express = require("express");
const nodejieba = require('nodejieba');
const tokenizer = new natural.WordTokenizer();

const router = express.Router({
  prefix: "/test",
});

router.post("/tags", async (req, res) => {
  console.log(req.body.Content === 'string', "req.body")
  const chineseArticleContent  = req.body.Content;
// 使用自然语言处理库分词
  const words = tokenizer.tokenize(articleContent);
  const tags = nodejieba.extract(chineseArticleContent, 3);
  console.log("提取的标签:", tags);
});

module.exports = router;