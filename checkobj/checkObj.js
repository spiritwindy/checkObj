/**
 * 未实现
 * 数组  string[]
 * @type {symbol}
 */
// var exports=module.exports/
exports.unrequired=Symbol("unrequired");  // 标记不需要的键
/**
 * 标记允许扩展 为true;
 * @type {symbol}
 */
exports.expand=Symbol("expand");
/**
 *
 * @param {any} obj 要检查的对象
 * @param {any} checker  检查器具
 * @return {Boolean}  正确返回true
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
        if (checker!== "") {
                return typeof obj === checker.toLowerCase()
        }
        else
            return true;
    }
    else  if(checker.constructor===RegExp){
        return typeof obj ==="string" && checker.test&&checker.test(obj);
    }
    /// /return arguments.callee({arr:obj,arr:checker});//反了....
    var checkerKey = Object.keys(checker);
    var objkey = Object.keys(obj);
    if(obj.constructor!==Object)
    {
        throw  "gg..内部异常"+typeof obj +typeof checker;
    }
    if(!checker[exports.expand])
    for (var j = 0, len = objkey.length; j < len; j++) {
        if (!checker.hasOwnProperty(objkey[j]))
            return false;
    }// 多余属性 返回错误
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
/**
 * 全局校验
 * @type {Map}
 */
var genRule=new Map(); //
genRule.set(Function,function () {
   return "function"
});
/**
 * @param type # constructor
 * callVal(val)l
 */
function setGenRule(type,callVal) {
    genRule.set(type,callVal);
}

/**
 *
 * @param obj
 * @param {Map} genRuleargu
 * @return {*}
 */
var gen_checker= function (obj,genRuleargu) {
   // var genRule=genRuleargu||genRule;
    if(!genRuleargu){
        var genRule0=genRule;
    }else { //放外层递归
        var genRule0=new Map();
        for (var [key,value] of genRuleargu) {
            genRule0.set(key,value);
        }
        for (var [key,value] of genRule) {
            if(!genRule0.has(key))
            genRule0.set(key,value);
        } //
    }
    var objType=typeof  obj;
    if(objType==="undefined"||obj===null){
        return "undefined"
    }
    var  cb=genRule0.get(obj.constructor);
       if(cb)
        return cb(obj);
    if(objType!=="object"){
        return objType;
    }
    if(obj.constructor===Array){
        if(obj.length>0)
        return [arguments.callee(obj[0])];
        else return [];
    }
    var checker={};
    var arr=Object.keys(Object.getOwnPropertyDescriptors(obj));
    for (var i=0,len=arr.length;i<len ;i++ ) {//遍历obj
        var key=arr[i];
        var type=typeof  obj[key];
        if(type!=="object"&&type!=="function" ){
            checker[key]=type;
        }else {
            checker[key]= arguments.callee(obj[key],genRule0);
        }
    }
    return checker
};

exports.gentsDoc=function (params) {
    var genRule=new Map([[Function,function (v) {
      var paramName=   v.toString().match(/\(.*?\)/);
      if(!paramName){
          paramName= v.toString().split(/\=\s*\>/)
      }
      var paramStr= paramName[0]||"()";
      return paramStr+"=>any"
    }]]);
    var obj=gen_checker(params,genRule);
    // var a = JSON.stringify(obj).replace(/\"/g,"");
    // a=a.replace(/\:function/g,"(...params):any").replace(/\,/g,";\n");
    return tsObjtoString(obj);
  }
  function tsObjtoString(obj) {
    if(obj.__proto__!=Object.prototype)
      return obj;
    var arr=[]//,"}"
    for(var k in obj){
        if(k=="constructor"){
            continue;
        }
        arr.push(k+":"+tsObjtoString(obj[k]))
    }
    return "{"+ arr.join(";\n")+"}";
  }
  exports.genTypeDoc=function (params) {
    var a=  JSON.stringify(gen_checker(params)).replace(/\"/g,""); 
    return a;
  }

exports.checkObj = checkObj;
exports.gen_checker=gen_checker;
exports.setGenRule=setGenRule;
