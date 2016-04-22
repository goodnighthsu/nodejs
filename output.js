var ServerResponse = require('http').ServerResponse;

/**
 * @param code 错误代码 200 为正确
 * @param message 提示消息
 * @param data 返回数据
 * @return json
 */
if (!ServerResponse.prototype.formatOutput)
{
    ServerResponse.prototype.formatOutput = function()
    {
        var code = arguments[0];
        var message =  arguments[1];
        var data  = arguments[2];
        var result = {};
        if (code == 200)
        {
            result = {'data': data, 'code': code, 'message': message, 'success': true};
        }else
        {
            result = {'data': null, 'code': code, 'message': message, 'success': false};
        }
        this.json(result);
    }
}