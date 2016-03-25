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

router.route('/api/user/:id')
    //Get User Info
    .get(function (req, res) {
        var userId = req.params.id;
        var userSql = sql.select()
            .field('id')
            .field('userName', 'name')
            .field('mobile')
            .field('UNIX_TIMESTAMP(createDDate)', 'createdDate')
            .from('Users_Table')
            .where('id = ?', userId);
        dao.execute(userSql, function (error, result) {
            if (error) {
                res.json(output.error(error.errno, error.description));
            } else {
                var data = {};
                data['data'] = result;
                data['code'] = 200;
                data['success'] = true;
                res.json(data);
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
        if (user.id == null) {
            res.json(output.errorMessage(10008, '用户ID不能为空'));
        }

        //用户名字母开头6-255位
        if (user.name != null && !user.validateName(user.name)) {
            errorCode = 10002;
        }

        //Password
        if (user.password != null && !user.validatePassword(user.password)) {
            errorCode = 10004;
        }

        //Mobile
        if (user.mobile != null && !user.validateMobile(user.mobile)) {
            errorCode = 10009;
        }

        //Email
        if (user.email != null && !user.validateEmail(user.email))
        {
            errorCode = 10007;
        }

        if (errorCode != null) {
            res.json(output.error(errorCode));
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

        dao.execute(modifySql, function (error, result) {
            if (error) {
                if (error.errno == 1062) {
                    res.json(output.error(10006));
                } else {
                    res.json(output.error(error.errno, error.description));
                }
            } else {
                res.json(output.success(user));
            }
        })
    })
    //Delete User
    .delete(function (req, res) {
        var user = new UserItem();
        user.id = req.params.id;
        if (user.id == null) {
            res.json(output.error(10008));
        } else {
            var deleteSql = sql.delete()
                .from('Users_Table')
                .where('id = ?', user.id);
            dao.execute(deleteSql, function (error, result) {
                if (error) {
                    res.errorMessage(error.errno, error.description);
                } else {
                    res.json(output.success(user));
                }
            })
        }
    });

router.route('/api/user')
    //Create User
    .post(function (req, res) {
        var user = new UserItem();
        var errorCode;
        //Create User
        //name
        user.name = req.body.name;
        //用户名字母开头6-255位
        if (user.name == null) {
            errorCode = 10001;
        } else if (!user.validateName(user.name)) {
            errorCode = 10002;
        }

        //Password
        user.password = req.body.password;
        if (user.password == null) {
            errorCode = 10003;
        } else if (!user.validatePassword(user.password)) {
            errorCode = 10004;
        }

        user.password2 = req.body.password2;
        if (user.password != user.password2) {
            errorCode = 10005;
        }
        //前置检查 name password
        if (errorCode != null) {
            res.json(output.error(errorCode));
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
                            res.json(output.error(10006));
                        }else
                        {
                            res.json(output.error(error.errno, error.description));
                        }
                    }else
                    {
                        user.id = result.insertId;
                        res.json(output.success(user));
                    }
                });
            },
            function (error) {
                res.json(output.errorMessage(error.number, error.description));
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
