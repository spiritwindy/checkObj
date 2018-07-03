exports.sym = {
  unrequired: Symbol("unrequired"), //  标记不需要的键数组  string[] 未实现
  expand: Symbol("expand") //标记允许扩展 为true;
};
exports.defChecker={
"array":Array.isArray
};
/**
 * 
 * @param {String} name 
 * @param {*} checker 
 */
exports.addChecker=function (name,checker) {
  exports.defChecker[name]=checker
}
exports.delChecker=function (name) {
  delete exports.defChecker[name]
}
/**
 *
 * @param {any} obj 要检查的对象
 * @param {any} checker  检查器
 * @return {Boolean}  正确返回true
 */
function checkObj(obj, checker) {
  // if (!obj) return false;//debigger
  if (checker.constructor === Function) return checker(obj); // 函数校验
  if (checker.constructor === Array) {
    //数组校验
    if (!Array.isArray(obj)) return false;
    var arr = obj;
    if (checker.length === 1) {
      //长度为1可以 作为整个数组的检测
      var ck_arr0 = checker[0];
      var res = true;
      for (var i1 = 0, len4 = arr.length; i1 < len4; i1++) {
        // 校验数组
        if (ck_arr0.constructor === Function) res = ck_arr0(arr[i1], i1);
        //函数校验器 可以允许有 传当前val 以及 key
        else res = arguments.callee(arr[i1], ck_arr0);
        if (!res) return false;
      }
    } else if (checker.length > 1) {
      //长度为大于1 每个数组分开检测
      if (checker.length !== obj.length) return false;
      for (var i2 = 0, len2 = arr.length; i2 < len2; i2++) {
        var res1 = arguments.callee(arr[i2], checker[i2]);
        if (!res1) return false;
      }
    }
    return true;
  } else if (checker.constructor === String) {
    if(exports.defChecker.hasOwnProperty(checker)){
      return arguments.callee(obj,exports.defChecker[checker]);
    }
    else if (checker !== "") {
      return typeof obj === checker.toLowerCase();
    }
     else return true;
  }
   else if (checker.constructor === RegExp) {
    return typeof obj === "string" && checker.test && checker.test(obj);
  }


  /// /return arguments.callee({arr:obj,arr:checker});//反了....
  var checkerKey = Object.keys(checker);
 
  if (typeof obj!="object" || obj.constructor !== Object ||obj===null) {
    throw "..内部异常" + typeof obj + typeof checker;
  }
  var objkey = Object.keys(obj);
  if (!checker[exports.sym.expand])
    for (var j = 0, len = objkey.length; j < len; j++) {
      if (!checker.hasOwnProperty(objkey[j])) return false;
    } // 多余属性 返回错误
  for (var i = 0, len = checkerKey.length; i < len; i++) {
    var checker_Key = checkerKey[i];
    if (!obj.hasOwnProperty(checker_Key)) return false;
 
    if (checker[checker_Key].constructor === Function) {
      if (!checker[checker_Key](obj[checker_Key], checker_Key))
        //传所在键的 key  // 一个校验不通过 返回
        return false;
    } else if (checker[checker_Key].constructor === Array) {
      // 长度为0 默认 校验为数组
      var obj_arr1 = obj[checker_Key];
      var checker_arr2 = checker[checker_Key];
      if (!arguments.callee(obj_arr1, checker_arr2))
       return false;
    }else{
      if (!arguments.callee(obj[checker_Key],checker[checker_Key])) {
        return false;
      }
    }
  }
  return true;
}


exports.checkObj = checkObj;