const db = require('../db/index')

exports.getCates = (req, res) => { 
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sql, (err, results) => { 
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: results
        })
    })
}

exports.addArticleCates = (req, res) => { 
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sql, [req.body.name, req.body.alias], (err, results) => { 
        if (err) return res.cc(err)
        if (results.length > 0) return res.cc('name或者alias有重复，请换一个')

        const sql_insert = 'insert into ev_article_cate set ?'
        db.query(sql_insert, req.body, (err, results) => { 
            if (err) return res.cc(err) 
            if (results.affectedRows !==1) return res.cc('插入文章分类失败！')
            res.cc('新增文章分类成功', 0)
        })
    })
}

exports.deleteCateById = (req, res) => { 
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, req.params.id, (err, results) => { 
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功！', 0)
    })
}

exports.getArtCateById = (req, res) => { 
    const sql = 'select * from ev_article_cate where id=?'
    db.query(sql, req.params.id, (err, results) => { 
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章分类数据失败')
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0]
        })
    })
}

exports.updateCateById = (req, res) => { 
    // 先查重
    const sql = 'select * from ev_article_cate where Id!=? and (name=? or alias=?)'
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => { 
        if (err) return res.cc(err)
        if (results.length > 0 ) return res.cc('有重复，请换一个')
        const sql_update = 'update ev_article_cate set ? where Id=?'
        db.query(sql_update, [req.body, req.body.Id], (err, results) => { 
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新失败')
            res.cc('更新成功', 0)
        })
    })
}