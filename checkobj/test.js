// /const
var checkObj=require("./checkObj.js").checkObj;
var checker = {
    "a": "undefined", "b": "number",c:""
};

var checker1 = {
    "a": "undefined", "b": "number",c:"",d:{
        "a": "undefined", "b": "number",c:""
    }
};
var checkFunc = {
    a: function (val) {
        return val % 2 === 0;
    }, b: [
        function (val) {
            return val % 3 === 0;
        }
    ]
};

/*checker.d=;*/
console.log("[[["+checkObj({a:"555",b:555,c:undefined},checker));
console.log("[[["+checkObj({a:undefined,b:555,c:"test String",d:{a:undefined,b:555,c:"num"}},checker));//false
console.log("[[["+checkObj({a:undefined,b:555,c:"test String",d:{a:undefined,b:555,c:"num"}},checker1));//true
console.log("[[["+checkObj({a:undefined,b:555,c:"test String"},checker));//true
console.log("[[["+checkObj({a:555,b:"555",c:undefined},checker));
var a={"a":2,"b":[3,6,9]};

console.log(JSON.stringify(a)+":"+checkObj(a,checkFunc));// true  函数 检测 数据
console.log(JSON.stringify(a.b)+":"+checkObj(a.b,checkFunc.b));// true 函数 检测 数据

console.log([3,7,8]+":"+checkObj([3,7,8],["number"]));// true  数组 ,检测器为数组 //
