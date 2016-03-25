exports.error = function(errorCode)
{
    var message;
    switch (errorCode)
    {
        case 10001:
            message = '用户名不能为空';
            break;
        case 10002:
            message = '无效的用户名';
            break;
        case 10003:
            message = '密码不能为空';
            break;
        case 10004:
            message = '无效的密码';//密码必须包含数字,字符, 长度至少6位
            break;
        case 10005:
            message = '两次密码不一致';
            break;
        case 10006:
            message = '用户已存在';
            break;
        case 10007:
            message = '邮件地址不正确';
            break
        case 10008:
            message = '用户ID不能为空';
        default:
            errorCode = 4000;
            message = '未知错误';
    }

    var json = {'data': null, 'code': errorCode, 'message': message, 'success': false};
    return json;
}

exports.errorMessage =function(errorCode, message)
{
    var json = {'data': null, 'code': errorCode, 'message': message, 'success': false};
    return json;
}

exports.success = function(data)
{
    var json = {'data':data, 'code': 200, 'message': 'success', 'success': true};
    return json;
}
