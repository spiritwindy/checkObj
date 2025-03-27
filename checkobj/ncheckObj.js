exports.sym = {
  unrequired: Symbol.for("unrequired"), //  标记不需要的键数组  string[] 未实现
  expand: Symbol.for("expand"), //标记允许扩展 为true;
  keys: Symbol.for("keys"),
  value: Symbol.for("value")
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
 * @return {Object} 返回包含校验结果的对象
 */
function checkObj(obj, checker, opt = { path: "" }) {
  if (checker.constructor === Function) {
    if (!checker(obj)) {
      return { success: false, error: "Function check failed", value: obj, property: opt.path };
    }
    return { success: true };
  }

  if (Array.isArray(checker)) {
    if (!Array.isArray(obj)) {
      return { success: false, error: "Expected array", value: obj };
    }
    var arr = obj;
    if (checker.length === 1) {
      var ck_arr0 = checker[0];
      for (var i1 = 0, len4 = arr.length; i1 < len4; i1++) {
        var res = ck_arr0.constructor === Function ? ck_arr0(arr[i1], i1) : checkObj(arr[i1], ck_arr0, { path: opt.path + "[" + i1 + "]" });
        if (res !== true && res.success !== true) {
          return { success: false, error: "Array check failed", index: i1, value: arr[i1], reason: res };
        }
      }
    } else if (checker.length > 1) {
      if (checker.length !== obj.length) {
        return { success: false, error: "Array length mismatch", expected: checker.length, actual: obj.length };
      }
      for (var i2 = 0, len2 = arr.length; i2 < len2; i2++) {
        var res1 = checkObj(arr[i2], checker[i2], { path: opt.path + "[" + i2 + "]" });
        if (res1.success !== true) {
          return { success: false, error: "Array element check failed", index: i2, value: arr[i2], reason: res1 };
        }
      }
    }
    return { success: true };
  }

  if (typeof checker === "string") {
    if (exports.defChecker.hasOwnProperty(checker)) {
      return checkObj(obj, exports.defChecker[checker], { path: opt.path });
    } else if (checker !== "") {
      if (typeof obj !== checker.toLowerCase()) {
        return { success: false, error: "Type mismatch", expected: checker.toLowerCase(), actual: typeof obj };
      }
      return { success: true };
    }
    return { success: true };
  }

  if (checker.constructor === RegExp) {
    if (typeof obj !== "string" || !checker.test(obj)) {
      return { success: false, error: "RegExp check failed", value: obj };
    }
    return { success: true };
  }

  var checkerKey = Object.keys(checker);

  if (typeof obj !== "object" || obj.constructor !== Object || obj === null) {
    return { success: false, error: "Invalid object", value: obj };
  }

  var objkeys = Object.keys(obj);
  if (!checker[exports.sym.expand]) {
    for (var j = 0, len = objkeys.length; j < len; j++) {
      if (!checker.hasOwnProperty(objkeys[j])) {
        return { success: false, error: "Unexpected property", property: objkeys[j] };
      }
    }
  }
  let cks = getCheckKey(checker);

  for (var i = 0, len = cks.length; i < len; i++) {
    var checkerKey = cks[i];
    var checkPath = opt.path + "." + checkerKey;
    if (!obj.hasOwnProperty(checkerKey)) {
      return { success: false, error: "Missing property", property: checkPath };
    }

    var res;
    if (checker[checkerKey].constructor === Function) {
      res = checker[checkerKey](obj[checkerKey], checkerKey);
      if (!res) {
        return { success: false, error: "Function check failed", property: checkPath, value: obj[checkerKey] };
      }
    } else if (Array.isArray(checker[checkerKey])) {
      res = checkObj(obj[checkerKey], checker[checkerKey], { path: checkPath });
      if (res.success !== true) {
        return { success: false, error: "Array check failed", property: checkPath, value: obj[checkerKey], reason: res };
      }
    } else {
      res = checkObj(obj[checkerKey], checker[checkerKey], { path: checkPath });
      if (res.success !== true) {
        return { success: false, error: "Property check failed", property: checkPath, value: obj[checkerKey], reason: res };
      }
    }
  }
  if (checker[exports.sym.keys]) {
     return checkObj(objkeys, [checker[exports.sym.keys]], { path: opt.path + "#keys" +  });
  }
  if (checker[exports.sym.value]) {
    let values = Object.values(obj);
    return checkObj(values, [checker[exports.sym.value]], { path: opt.path + "#value" });
  }
  return { success: true };
}
function getCheckKey(checker) {
  let checkKesys = Object.keys(checker);
  return checkKesys.filter(v => {
    return v != exports.sym.expand
  })
}

exports.checkObj = checkObj;