const express = require('express')
const app = express()
const joi = require('joi')

// 配置跨域
const cors = require('cors')
app.use(cors())

// 配置解析 application/x-www-form-rulencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 封装错误处理函数
app.use((req, res, next) => { 
    res.cc = (err, status = 1) => { 
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 在路由之前配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/]}))

// 导入并使用路由模块
const useRouter = require('./router/user')
app.use('/api', useRouter)
// 用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 定义错误级别中间件
app.use((err, req, res, next) => { 
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败 token错误')
    res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007 ......');
})