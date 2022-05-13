const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const { add_cate_schema, delete_cate_schema, get_cata_schema, update_cate_schema } = require('../schema/artcate')

const artcate_handle = require('../router-handler/artcate')

router.get('/cates', artcate_handle.getCates)
router.post('/addcates', expressJoi(add_cate_schema), artcate_handle.addArticleCates)
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handle.deleteCateById)
router.get('/cates/:id', expressJoi(get_cata_schema), artcate_handle.getArtCateById)
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handle.updateCateById)

module.exports = router
