/**
 * Created by leon on 16/3/25.
 */
var express = require('express');
var router = express.Router();
var UserItem = require('../model/UserItem');
var output = require('../output');
var dao = require('../dao/dao');
var sql = require('squel');
var jwt = require('jwt-simple');

/** 用户登录
 * POST 方法
 * @param name 用户名
 * @param password 密码
 */
router.route('/api/login')
    .post(function (req, res) {
        var user = new UserItem();
        user.name = req.body.name;
        user.password = req.body.password;

        user.passwordMD5();

        if (user.name == null) {
            res.formatOutput(10001, '用户名不能为空');
        }

        if (user.password == null) {
            res.formatOutput(10002, '密码不能为空');
        }

        var userSql = sql.select()
            .from('Users_Table')
            .where('userName = ? && password = ?', user.name, user.passwordMD5());
        console.log('userSql: %s', userSql.toString());
        dao.execute(userSql, function (error, result) {
            if (error) {
                res.formatOutput(error.errno, error.description);
            } else {
                if (result.length == 0)
                {
                    res.formatOutput(10003, '用户名或密码错误');
                }else {
                    user = UserItem.ParseWithJSON(result[0]);
                    //Token
                    var payload = {"userId": user.id, "expires": Date.now()+60*60*2*1000};
                    var token = jwt.encode(payload, req.app.get('JWTSecrete'));
                    res.formatOutput(200,'Login Success', {'token':token});
                }
            }
        });
    });

module.exports = router;