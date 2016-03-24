var mysql = require('mysql');

var pool = mysql.createPool(
    {
        connectionLimit : 100,
        host            : 'localhost',
        user            : 'MyWebDB',
        password        : 'mywebdb',
        database        : 'MyWebDB'
    }
)

var execute = function(sql, res, callback) {
    pool.getConnection(function (err, connection)
    {
        if (err)
        {
            console.log('error: %s', err);
            res.status(500);
            callback(err, null);
        }else
        {
            if (sql !== 'string')
            {
                sql = sql.toString();
            }
            connection.query(sql, function(error, rows, fields)
            {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, rows);
                }
            });
        }
    });
}

exports.execute = execute;
