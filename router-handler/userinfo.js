const db = require('../db/index')
const sql_select = 'select id, username, nickname, email, user_pic from ev_users where id=?'
const sql_update = 'update ev_users set ? where id=?'
const sql_update_password = 'update ev_users set password=? where id=?'
const bcrypt = require('bcryptjs')

exports.getUserInfo = (req, res) => { 
    db.query(sql_select, req.user.id, (err, results) => { 
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败')
        res.send({
            staus: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })

}

exports.updateUserInfo = (req, res) => { 
    if (req.user.id !== req.body.id) return res.cc('ID不可修改！')
    db.query(sql_update, [req.body, req.user.id], (err, results) => { 
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('修改用户信息失败')
        return res.cc('修改用户信息成功', 0)
    })
}

exports.updatePassword = (req, res) => { 
    const sql = 'select * from ev_users where id=?'
    db.query(sql, req.user.id, (err, results) => { 
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在！')
        // 判断旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        // 修改密码
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql_update_password, [newPwd, req.user.id], (err, results) => { 
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('修改用户密码失败')
            return res.cc('修改用户密码成功', 0)
        })

    })
}

exports.updateAvatar = (req, res) => {
    res.cc('okk')
    const sql_update_avatar = 'update ev_users set user_pic=? where id=?'
    db.query(sql_update_avatar, [req.body.avatar, req.user.id], (err, results) => { 
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败')
        return res.cc('更新头像成功', 0)
    })
}