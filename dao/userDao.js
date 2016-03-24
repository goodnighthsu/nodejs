
//
//exports.router = function(){
//    router.get('/api/user/:id', function(req, res, next)
//    {
//        console.log('user id: %s', req.params.id);
//        var userId = req.params.id;
//        var userSql = sql.select()
//            .field('id')
//            .field('userName', 'name')
//            .field('mobile')
//            .field('UNIX_TIMESTAMP(createDDate)', 'createdDate')
//            .from('Users_Table')
//            .where('id = ?', userId);
//        console.log('userSql: %s', userSql.toString());
//        dao.execute(userSql, res, function(error, result)
//        {
//            if (error)
//            {
//                res.json({'data':null, 'code':500, 'message':error, 'success':false});
//            }else
//            {
//                var data = {};
//                data['data'] = result;
//                data['code'] = 200;
//                data['success'] = true;
//
//                res.json(data);
//            }
//        });
//    })
//};