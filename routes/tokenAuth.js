/**
 * Created by leon on 16/4/22.
 */
var jwt = require('jwt-simple');

///Token 验证
var tokenAuth = function(req, res, next)
{
    var token = req.header('token');
    //console.log('token: %s', token);
    //console.log('secrete: %s', req.app.get('JWTSecrete'));
    if (token)
    {
        try {
            var decode = jwt.decode(token, req.app.get('JWTSecrete'));
            console.log('expires: %s', decode.expires);
            if (decode.expires < Date.now())
            {
                res.formatOutput(10002, 'Token expires');
            }else
            {
                next();
            }

        }catch(error)
        {
            res.formatOutput(10001, 'Invaild Token');
        }
    }else
    {
        res.formatOutput(10004,'Accesss denied, miss token');
    }
}

module.exports = tokenAuth;