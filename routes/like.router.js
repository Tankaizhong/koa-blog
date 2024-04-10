// like.router.js

const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
// const likeControl = require('../controllers/like.control');
const {addLike,checkUserLiked,cancelLike} = require('../controller/like.control')

const router = express.Router({
  prefix: "/like",
});

// 添加点赞
router.post('/addlike', verifyToken, addLike);

// 检查用户是否已点赞
router.post('/check', verifyToken, checkUserLiked);

// 取消点赞
router.delete('/unlike', verifyToken, cancelLike);

module.exports = router;
