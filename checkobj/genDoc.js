/**
 * 全局校验
 * @type {Map}
 */
var genRule = new Map(); //
genRule.set(Function, function () {
  return "function";
});

/* genRule.set(Array, function(v) {
  return [gen_checker(v[0])];
}); */

/**
 * @param type # constructor
 * callVal(val)
 */
function setGenRule(type, callVal) {
  genRule.set(type, callVal);
}

/**
 * @param obj
 * @param {Map} genRuleargu
 * @return {*}
 */
var gen_checker = function (obj, genRuleargu, opt ={deep:1}) {
  // var genRule=genRuleargu||genRule;
  if (!genRuleargu) {
    var genRule0 = genRule;
  } else {
    //放外层递归
    var genRule0 = new Map();
    for (var [key, value] of genRuleargu) {
      genRule0.set(key, value);
    }
    for (var [key, value] of genRule) {
      if (!genRule0.has(key)) genRule0.set(key, value);
    }
  }
  var objType = typeof obj;
  if (objType === "undefined" || obj === null) {
    return "undefined";
  }
  var cb = genRule0.get(obj.constructor);
  if (cb) return cb(obj);
  if (objType !== "object") {
    return objType;
  }
  if(objType == "object" && opt.deep<=0) {
    return objType
  }
  if (Array.isArray(obj)) {
    if (obj.length > 0) return [gen_checker(obj[0],null,{deep:opt.deep-1})];
    else return [];
  }
  var checker = {};
  var arr = Object.keys(Object.getOwnPropertyDescriptors(obj));
  for (var i = 0, len = arr.length; i < len; i++) {
    //遍历obj
    var key = arr[i];
    var type = typeof obj[key];
    if (type !== "object" && type !== "function") {
      checker[key] = type;
    } else {
      checker[key] = gen_checker(obj[key], genRule0,{deep:opt.deep-1});
    }
  }
  return checker;
};

let { funcString } = require("./util/funcString");
exports.gentsDoc = function (params) {
  var genRule = new Map([
    [
      Function,
      funcString
    ]
  ]);
  var obj = gen_checker(params, genRule);
  // var a = JSON.stringify(obj).replace(/\"/g,"");
  // a=a.replace(/\:function/g,"(...params):any").replace(/\,/g,";\n");
  return tsObjtoString(obj);
};

function tsObjtoString(obj) {
  if (Array.isArray(obj)) {
    return tsObjtoString(obj[0]) + "[]";
  }
  if (obj.__proto__ != Object.prototype) return obj;
  var arr = []; //,"}"
  for (var k in obj) {
    if (k == "constructor") {
      continue;
    }
    arr.push((/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(k) ? k : JSON.stringify(k)) + ":" + tsObjtoString(obj[k]));
  }
  return "{" + arr.join(";\n") + "}";
}

exports.genTypeDoc = function (params) {
  var a = JSON.stringify(gen_checker(params)).replace(/\"/g, "");
  return a;
};
exports.setGenRule = setGenRule;
exports.gen_checker = gen_checker;

