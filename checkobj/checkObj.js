/**
 *
 * @param {Object} obj 要检查的对象
 * @param {any} checker  检查器具
 * @return {Boolean}
 */
function checkObj(obj, checker) {
    if (!obj) return false;
    if(checker.constructor===Function)return checker(obj);// 函数校验
    if(checker.constructor===Array){ //数组校验
        if (obj.constructor !== Array) return false;
        var arr = obj;
        if (checker.length === 1) { //长度为1可以 作为整个数组的检测
            var ck_arr0 = checker[0];
             var res=true;
            for (var i1 = 0, len4 = arr.length; i1 < len4; i1++) {// 校验数组
                if(ck_arr0.constructor===Function)
                   res= ck_arr0(arr[i1],i1);//函数校验器 可以允许有 传当前val 以及 key
                else
                 res = arguments.callee(arr[i1], ck_arr0);
/*                console.log(arr[i1], ck_arr0);
                console.log(res);*/
                if (!res)
                    return false;
            }
        }
        else if (checker.length > 1) {//长度为大于1 每个数组分开检测
            if (checker.length !== obj.length)
                return false;
            for (var i2 = 0, len2 = arr.length; i2 < len2; i2++) {
                var res1 = arguments.callee(arr[i2], checker[i2]);
                if (!res1)
                    return false;
            }
        }
        return true;
    }
    else if (checker.constructor === String) {
        if (checker !== "") {
                return typeof obj === checker.toLowerCase()
        }
        else
            return true
    }

    /// /return arguments.callee({arr:obj,arr:checker});//反了....
    var checkerKey = Object.keys(checker);
    var objkey = Object.keys(obj);

    if(obj.constructor!==Object)
    {
       // debugger
        throw  "gg..内部异常"+typeof obj +typeof checker;
    }

    for (var j = 0, len = objkey.length; j < len; j++) {
        if (!checker.hasOwnProperty(objkey[j]))
            return false;
    }// 多余属性 返回错误i
    for (var i = 0, len = checkerKey.length; i < len; i++) {
        var checker_Key = checkerKey[i];
        if (!obj.hasOwnProperty(checker_Key))
            return false;
        if (checker[checker_Key].constructor === String) {
            if (checker[checker_Key] !== "") {
                if (typeof obj[checker_Key] !== checker[checker_Key].toLowerCase())
                    return false
            }
        } else if (checker[checker_Key].constructor === Object) {
            // console.log("自身调用");
            var res2 = arguments.callee(obj[checker_Key], checker[checker_Key]);
            if (!res2)
                return false;
        }
        else if (checker[checker_Key].constructor === Function) {
            if (!checker[checker_Key](obj[checker_Key],checker_Key))  //传所在键的 key  // 一个校验不通过 返回
                return false;
        }
        else if (checker[checker_Key].constructor === Array) {
            // 长度为0 默认 校验为数组
            var obj_arr1 = obj[checker_Key];
            var checker_arr2 = checker[checker_Key];
          if(!arguments.callee(obj_arr1,checker_arr2)) return false;
        }
    }
    return true;
}



var gen_checker= function (obj) {
    var objType=typeof  obj;
    if(objType!=="object"){
        return typeof  obj;
    }
    if(obj.constructor===Array){
        if(obj.length>0)
        return [arguments.callee(obj[0])];
        else return [];
    }
    var checker={};
    for (var key in obj) {
        var type=typeof  obj[key];
        if(type!=="object" ){
            checker[key]=type;
        }else {
            checker[key]= arguments.callee(obj[key]);
        }
    }
    return checker
};

exports.checkObj = checkObj;
exports.gen_checker=gen_checker;