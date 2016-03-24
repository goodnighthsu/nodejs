/**
 * Created by leon on 16/3/24.
 */
module.exports = function UserItem()
{
    this.id;
    this.name;
    this.password;
    this.password2; //第二次输入的密码
    this.mobile;

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
    }

    //Validate password
    this.validatePassword = function(password){
        //密码数字+字母6位,不能全是数字或字母
        var reg = /(?!^\[0-9]+$)(?!^[a-zA-Z]+$)^.{6,}$/;
        if (password == null || !reg.test(password)) {
            return false;
        }

        return true;
    }

    //Validate Mobile
    this.validateMobile = function(mobile)
    {
        var reg = /^[1]\d{10}$/;
        if (mobile == null || !reg.test(mobile))
        {
            return false;
        }

        return true;
    }

    //Validate Email
    this.validateEmail = function(email)
    {
        var reg =  /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if(email == null || !reg.test(email))
        {
            return false;
        }

        return true;
    }
}
