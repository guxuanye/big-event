const express = require('express')
const router = express.Router()
const article_handler = require('../router-handler/article')

// 配置multer，解析 multipart/form-data 格式的数据
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads')})

// 自动验证表单数据
const expressJoi = require('@escook/express-joi')
const { add_article_schema } = require('../schema/article')

router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)


module.exports = router