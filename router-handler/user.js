const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const sql_selectUser = 'select * from ev_users where username=?'
const sql_insertdUser = 'insert into ev_users set ?'

exports.regUser = (req, res) => { 
    let { username, password } = req.body

    db.query(sql_selectUser, [username], (err, result) => { 
        if (err) { 
            return res.cc(err)
        }
        if (result.length > 0) {
            return res.cc('用户名被占用，请更换用户名')
        }
        password = bcrypt.hashSync(password, 10)
        db.query(sql_insertdUser, { username, password }, (err, result) => { 
            if (err) { 
                return res.cc(err) 
            }
            if (result.affectedRows !==1) {
                res.cc('用户注册失败，请稍后再试')
            }
            res.cc('用户注册成功', 0)
        })
    })
    
    // res.send('reguser OK')
}

exports.login = (req, res) => {
    const userinfo = req.body
    db.query(sql_selectUser, userinfo.username, (err, results) => { 
        if (err) return res.cc(err)
        if (results.length !==1) return res.cc('登录失败')
        // 验证密码是否正确 
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('密码错误')
        }
        // 生成token字符串
        const user = { ...results[0], password:'', user_pic: ''}
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h'
        })
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
}