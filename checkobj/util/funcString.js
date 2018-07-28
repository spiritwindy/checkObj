const funcString = (function(v) {
  let fString = Function.prototype.toString;
  return function(v) {
    /**
     * @type {String}
     */
    let funcStr = fString.call(v);
    var paramName = funcStr.match(/\(.*?\)/);
    if (!paramName) {
      paramName = funcStr.split(/\=\>/);
      paramName[0] && (paramName[0] = paramName[0].replace(/^async\s/, ""));
    }
    var types = funcStr.match(/^async/);
    let funcType = (types && types[0]) || "";
    var paramStr = paramName[0] || "()";
    return funcType + paramStr + "=>any";
  };
})();
//  console.log(funcString(async =>{}));
//  console.log(funcString(async ()=>{}));
//  console.log(funcString( ()=>{}));
//  console.log(funcString(function  *(){}));
//  console.log(funcString((a)=>{}))
module.exports = { funcString };
