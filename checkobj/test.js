// /const
var checkObj = require("./index").checkObj;
var gen_checker = require("./index").gen_checker
var checker = {
    "a": "undefined", "b": "number", c: ""
};

var checker1 = {
    "a": "undefined", "b": "number", c: "", d: {
        "a": "undefined", "b": "number", c: ""
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

console.log("空字符串匹配任意类型(false, undefined 不允许设值):" + checkObj({ a: "555", b: 555, c: undefined }, checker));

console.log("默认不允许扩展属性(false):" + checkObj({ a: undefined, b: 555, c: "test String", d: { a: undefined, b: 555, c: "num" } }, checker));//false
console.log("正常测试用例（true）" + checkObj({ a: undefined, b: 555, c: "test String", d: { a: undefined, b: 555, c: "num" } }, checker1));//true
console.log("正常测试用例（true）" + checkObj({ a: undefined, b: 555, c: "test String" }, checker));//true
console.log("类型错误（false）" + checkObj({ a: 555, b: "555", c: undefined }, checker));



var a = { "a": 2, "b": [3, 6, 9] };

console.log(JSON.stringify(a) + ":" + checkObj(a, checkFunc));// true  函数 检测 数据
console.log(JSON.stringify(a.b) + ":" + checkObj(a.b, checkFunc.b));// true 函数 检测 数据

console.log([3, 7, 8] + ":" + checkObj([3, 7, 8], ["number"]));// true  数组 ,检测器为数组 //

console.log("检测val,key  函数检测器");
var result = checkObj([4, 3, 2, 1], [function (val, key) {// 逆序检测
    console.log("依次检测" + val + ":" + key);
    return val + key === 4
}]);
console.log("[4,3,2,1] 函数检验" + result);

//自动生成校验器

var dat = [{ a: 20, b: "asdhasud" }, { a: 20, b: "asdhasud" }, { a: 20, b: "asdhasud" }];
console.log(gen_checker(dat));
console.log(checkObj(dat, gen_checker(dat)));


dat = { a: 20, b: "asdhasud", c: { a: 20, b: "asdhasud" } };
console.log(gen_checker(dat));
console.log(checkObj(dat, gen_checker(dat)));
