#REST API
#概述
Node.JS 学习用户框架

已完成

获取、删除、修改用户信息， 用户登入等基本功能
##通用请求和响应
###通用请求头
Header key | Value | 说明
-|-|-
Content-Type|application/json|客户端发送json
Accept|application/json|客户端接受json
token|xxxx|登入后获取的token, 可选
####通用请求头
* 请求成功
	
		{
    	"data": {
        	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNDYxNzU5ODU1OTMzfQ.eedbbgJayxMl8ucDY3zBWHdNPt2nWqiLhgUJg-pzukk"        
    	},										//返回的数据
    	"code": 200,							//请求成功返回200
    	"message": "Login Success",				//提示消息
		}
* 请求失败

		{
    		"data": null,
    		"code": 10003,						//返回非200响应
    		"message": "用户名或密码错误",		   //提示消息
   			"success": false
	}


##1. 用户
###用户登入
#####接口地址 `POST /login`
#####请求体

	｛
		"name": "leon2",
		"password": "1234567"
	 ｝
#####响应体
	{
    	"data": {
        	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNDYxNzU5ODU1OTMzfQ.eedbbgJayxMl8ucDY3zBWHdNPt2nWqiLhgUJg-pzukk"        	
    	},
    	"code": 200,
    	"message": "Login Success",
    	"success": true
	}
 
### 获取用户信息
#### 接口地址 `GET /user/:id`
*token 必须*
######返回
	{
    "data": [
        {
            "id": 1,							//用户id
            "name": "leon2",					//用户名
            "mobile": "13917059633",			//用户手机号
            "createdDate": 1459161991			//用户创建时间
        }
    ],
    "code": 200,
    "message": null,
    "success": true
	}

### 修改用户信息
#### 接口地址 `PUT /user/:id`
*token 必须*
######请求体
	{
		"name": "leon",							//用户名   可选
		"password": ""							//用户密码 可选
		"mobile": "13917059633"					//手机号码 可选
	}
######响应体
	{
    "data": {
        "id": "1",
        "name": "leon3",
        "password": "1234567",
        "mobile": "13917059633",
    },
    "code": 200,
    "message": null,
    "success": true
	}

### 删除用户
#### 接口地址 `DELETE /user/:id｀
*token 必须*
######响应体
	{
    "data": {
        "id": "2"								//被删除的用户ID
    },
    "code": 200,
    "message": null,
    "success": true
	}

