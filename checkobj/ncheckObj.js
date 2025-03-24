exports.sym = {
    unrequired: Symbol("unrequired"), //  标记不需要的键数组  string[] 未实现
    expand: Symbol("expand") //标记允许扩展 为true;
  };
  exports.defChecker = {
    "array": Array.isArray
  };
  
  /**
   * 
   * @param {String} name 
   * @param {*} checker 
   */
  exports.addChecker = function (name, checker) {
    exports.defChecker[name] = checker;
  };
  
  exports.delChecker = function (name) {
    delete exports.defChecker[name];
  };
  
  /**
   *
   * @param {any} obj 要检查的对象
   * @param {any} checker 检查器
   * @return {Boolean|Object} 正确返回true，错误返回错误信息对象
   */
  function checkObj(obj, checker,opt = { path: ""}) {
    if (checker.constructor === Function) {
      if (!checker(obj)) {
        return { error: "Function check failed", value: obj, property: opt.path };
      }
      return true;
    }
  
    if ( Array.isArray(checker)) {
      if (!Array.isArray(obj)) {
        return { error: "Expected array", value: obj };
      }
      var arr = obj;
      if (checker.length === 1) {
        var ck_arr0 = checker[0];
        for (var i1 = 0, len4 = arr.length; i1 < len4; i1++) {
          var res = ck_arr0.constructor === Function ? ck_arr0(arr[i1], i1) : checkObj(arr[i1], ck_arr0,{path:opt.path+"["+i1+"]"});
          if (res !== true) {
            return { error: "Array check failed", index: i1, value: arr[i1], reason: res };
          }
        }
      } else if (checker.length > 1) {
        if (checker.length !== obj.length) {
          return { error: "Array length mismatch", expected: checker.length, actual: obj.length };
        }
        for (var i2 = 0, len2 = arr.length; i2 < len2; i2++) {
          var res1 = checkObj(arr[i2], checker[i2],{path:opt.path+"["+i2+"]"});
          if (res1 !== true) {
            return { error: "Array element check failed", index: i2, value: arr[i2], reason: res1 };
          }
        }
      }
      return true;
    }
  
    if (typeof checker==="string") {
      if (exports.defChecker.hasOwnProperty(checker)) {
        return checkObj(obj, exports.defChecker[checker],{path:opt.path});
      } else if (checker !== "") {
        if (typeof obj !== checker.toLowerCase()) {
          return { error: "Type mismatch", expected: checker.toLowerCase(), actual: typeof obj };
        }
        return true;
      }
      return true;
    }
  
    if (checker.constructor === RegExp) {
      if (typeof obj !== "string" || !checker.test(obj)) {
        return { error: "RegExp check failed", value: obj };
      }
      return true;
    }
  
    var checkerKey = Object.keys(checker);
  
    if (typeof obj !== "object" || obj.constructor !== Object || obj === null) {
      return { error: "Invalid object", value: obj };
    }
  
    var objkey = Object.keys(obj);
    if (!checker[exports.sym.expand]) {
      for (var j = 0, len = objkey.length; j < len; j++) {
        if (!checker.hasOwnProperty(objkey[j])) {
          return { error: "Unexpected property", property: objkey[j] };
        }
      }
    }
  
    for (var i = 0, len = checkerKey.length; i < len; i++) {
      var checkerKey = checkerKey[i];
      var checkPah = opt.path + "." + checkerKey;
      if (!obj.hasOwnProperty(checkerKey)) {
        return { error: "Missing property", property: checkPah };
      }
  
      var res;
      if (checker[checkerKey].constructor === Function) {
        res = checker[checkerKey](obj[checkerKey], checkerKey);
        if (!res) {
          return { error: "Function check failed", property: checkPah, value: obj[checkerKey] };
        }
      } else if ( Array.isArray(checker[checkerKey] )) {
        res = checkObj(obj[checkerKey], checker[checkerKey],{path:checkPah});
        if (res !== true) {
          return { error: "Array check failed", property: checkPah, value: obj[checkerKey], reason: res };
        }
      } else {
        res = checkObj(obj[checkerKey], checker[checkerKey],{path:checkPah});
        if (res !== true) {
          return { error: "Property check failed", property: checkPah, value: obj[checkerKey], reason: res };
        }
      }
    }
    return true;
  }
  
  exports.checkObj = checkObj;