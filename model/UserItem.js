/**
 * Created by leon on 16/3/24.
 */
var http  = require('http');
var querystring = require('querystring');
var crypto  = require('crypto');
var Q = require('q');

function UserItem()
{
    this.id;
    this.name;
    this.password;
    this.password2;     //第二次输入的密码
    this.mobile;
    this.email;
    this.zone;          //区号没有+号 86
    this.code;          //验证码

    //Parse with Json
    UserItem.ParseWithJSON = function(json)
    {
        var user = new UserItem();
        user.name = json.userName;
        user.password = json.password;
        user.mobile  = json.mobile;
        user.email = json.email;
        user.zone = json.zone;
        user.code = json.code;

        return user;
    };

    //Validate name
    this.validateName = function(userName)
    {
        //用户名字母开头6-255位
        var reg = /^[a-zA-z][a-zA-z0-9_@]{3,255}$/;
        if (userName == null ||!reg.test(userName) )
        {
            return false;
        }

        return true;
    };

    //Validate password
    this.validatePassword = function(password){
        //密码数字+字母6位,不能全是数字或字母
        var reg = /(?!^\[0-9]+$)(?!^[a-zA-Z]+$)^.{6,}$/;
        if (password == null || !reg.test(password)) {
            return false;
        }

        return true;
    };

    //Validate Mobile
    this.validateMobile = function(mobile)
    {
        var reg = /^[1]\d{10}$/;
        if (mobile == null || !reg.test(mobile))
        {
            return false;
        }

        return true;
    };

    //Validate Email
    this.validateEmail = function(email)
    {
        var reg =  /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if(email == null || !reg.test(email))
        {
            return false;
        }

        return true;
    };

    //Validate Code
    this.validateCode = function(phone, zone, code)
    {
        var postData =
        {
            'appkey':'10e806b993b98',
            'phone':phone,
            'zone':zone,
            'code':code
        };

        postData = querystring.stringify(postData);
        //
        var options =
        {
            host: 'webapi.sms.mob.com',
            path: '/sms/verify',
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencode',
                'Content-Length': postData.length
            }
        };

        var deffered = Q.defer();
        var req = http.request(options, function(response){
            var body = '';
            response.on('data', function(data)
            {
                body += data;
            });

            response.on('end', function()
            {
                body = JSON.parse(body);
                if (body.status == 200)
                {
                    deffered.resolve(body);
                }else
                {
                    var error = new Error();
                    error.errno = body.status;
                    var message;
                    switch (body.status)
                    {
                        case 405:
                            message = 'AppKey为空';
                            break;
                        case 406:
                            message = 'AppKey无效';
                            break;
                        case 456:
                            message = '国家代码或手机号码为空';
                            break;
                        case 457:
                            message = '手机号码格式错误';
                            break;
                        case 466:
                            message = '请求校验的验证码为空';
                            break;
                        case 467:
                            message = '请求校验验证码频繁';
                            break;
                        case 468:
                            message = '验证码错误';
                            break;
                        case 474:
                            message = '没有打开服务端验证开关';
                            break;
                    }

                    error.description = message;
                    deffered.reject(error);
                }
            });
        });

        req.on('error', function(error)
        {
            deffered.reject(error);
        });
        req.write(postData);
        req.end();
        return deffered.promise;
    }
};

UserItem.prototype.passwordMD5 = function()
{
    if (this.password == null){
        return null;
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(this.password).digest('base64');
    return password;
}

module.exports = UserItem;