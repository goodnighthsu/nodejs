/**
 * Created by leon on 16/3/23.
 */
var express = require('express');
var router = express.Router();
var dao = require('../dao/dao');
var sql = require('squel');
var output = require('../output');
var UserItem = require('../model/UserItem');
var Q = require('q');
var tokenAuth = require('./tokenAuth');

///用户所有的操作都需要验证token
router.all('/api/user/:id', tokenAuth);
router.route('/api/user/:id')
    //Get User Info
    .get(function (req, res) {
        var userId = req.params.id;
        var userSql = sql.select()
            .field('id')
            .field('userName', 'name')
            .field('mobile')
            .field('UNIX_TIMESTAMP(createDate)', 'createdDate')
            .from('Users_Table')
            .where('id = ?', userId);
        dao.execute(userSql, function (error, result) {
            if (error) {
                res.formatOutput(error.errno, error.description);
            } else {
                var data = {};
                res.formatOutput(200, null,  result);
            }
        });
    })
    //Modify User
    .put(function (req, res) {
        var user = new UserItem();
        user.id = req.params.id;
        user.name = req.body.name;
        user.password = req.body.password;
        user.mobile = req.body.mobile;
        user.email = req.body.email;

        var errorCode;
        var message;
        //用户名字母开头6-255位
        if (user.name != null && !user.validateName(user.name)) {
            errorCode = 10002;
            message = '无效的用户名';
        }

        //Password
        if (user.password != null && !user.validatePassword(user.password)) {
            errorCode = 10004;
            message = '无效的密码';//密码必须包含数字,字符, 长度至少6位
        }

        //Mobile
        if (user.mobile != null && !user.validateMobile(user.mobile)) {
            errorCode = 10009;
            message = '手机格式不正确';
        }

        //Email
        if (user.email != null && !user.validateEmail(user.email)) {
            errorCode = 10007;
            message = '邮件地址不正确';
        }

        if (errorCode != null) {
            res.formatOutput(errorCode, message, null);
            return;
        }

        var modifySql = sql.update()
            .table('Users_Table')
            .where('id = ?', user.id);
        if (user.name != null) {
            modifySql.set('userName', user.name);
        }
        if (user.password != null) {
            modifySql.set('password', user.password);
        }

        if (user.mobile != null) {
            modifySql.set('mobile', user.mobile);
        }
        if (user.name  == null && user.password == null && user.mobile == null)
        {
            //没有修改
            res.formatOutput(200, null, user);
            return;
        }

        dao.execute(modifySql, function (error, result) {
            if (error) {
                if (error.errno == 1062) {
                    res.formatOutput(10006, '用户已存在');
                } else {
                    res.formatOutput(error.errno, error.description);
                }
            } else {
                res.formatOutput(200, null, user);
            }
        })
    })
    //Delete User
    .delete(function (req, res) {
        var user = new UserItem();
        user.id = req.params.id;
        var deleteSql = sql.delete()
            .from('Users_Table')
            .where('id = ?', user.id);
        dao.execute(deleteSql, function (error, result) {
            if (error) {
                res.formatOutput(error.errno, error.description);
            } else {
                res.formatOutput(200, null, user);
            }
        })
    });

router.route('/api/user')
    //Create User
    .post(function (req, res) {
        var user = new UserItem();
        var errorCode;
        var message;
        //Create User
        //name
        user.name = req.body.name;
        //用户名字母开头6-255位
        if (user.name == null) {
            errorCode = 10001;
            message = '用户名不能为空';
        } else if (!user.validateName(user.name)) {
            errorCode = 10002;
            message = '无效的用户名';
        }

        //Password
        user.password = req.body.password;
        if (user.password == null) {
            errorCode = 10003;
            message = '密码不能为空';
        } else if (!user.validatePassword(user.password)) {
            errorCode = 10004;
            message = '无效的密码';//密码必须包含数字,字符, 长度至少6位
        }

        user.password2 = req.body.password2;
        if (user.password != user.password2) {
            errorCode = 10005;
            message = '两次密码不一致';
        }
        //前置检查 name password
        if (errorCode != null) {
            res.formatOutput(errorCode, message, null);
            return;
        }

        //Code
        user.mobile = req.body.mobile;
        user.zone = req.body.zone;
        user.code = req.body.code;

        user.validateCode(user.mobile, user.zone, user.code).then(function (result) {
                createUser(user, function(error, result)
                {
                    if (error)
                    {
                        if (error.errno == 1062){
                            res.formatOutput(10006, '用户已存在', null);
                        }else
                        {
                            res.formatOutput(error.errno, error.description);
                        }
                    }else
                    {
                        user.id = result.insertId;
                        res.formatOutput(200, null, user);
                    }
                });
            },
            function (error) {
                res.formatOutput(error.errno, error.description);
            });
    });

//Create User
function createUser(user, callback)
{
    var createUserSql = sql.insert()
        .into('Users_Table')
        .set('userName', user.name)
        .set('password', user.password);
    dao.execute(createUserSql, function(error, result)
    {
        callback(error, result);
    });
}

module.exports = router;