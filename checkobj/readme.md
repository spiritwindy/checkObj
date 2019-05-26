函数检验
====================
## 安装

```bash
 npm install checkobj
```

## 总览
```javascript
var checkObj=require("checkobj").checkObj;
checkObj(obj,checker)//支数组，对象，字符串、

var gen_checker=require("checkobj").gen_checker;// 生成校验器
gen_checker(obj)// 自动生成校验器
```
### 基础
```javascript
var assert=require("assert");
var checkobj=require("../index");
assert.strictEqual(checkobj.checkObj(true,"boolean"),true);
assert.strictEqual(checkobj.checkObj(false,"string"),false);
assert.strictEqual(checkobj.checkObj(1,"number"),true);
assert.strictEqual(checkobj.checkObj(null,"object"),true);
assert.strictEqual(checkobj.checkObj({},"object"),true);
```
其中 基础类型只是对 type var 用来做验证
###  字符串正则校验
```javascript (1.10新增)
checkobj.checkObj("aaaa1",/a{4}/)
true
checkobj.checkObj("aaa1",/a{4}/)
false
```
### 标记扩展属性


### 多级别校验

 ```javascript
 dat={a:20,b:"asdhasud",c:{a:20,b:"asdhasud"}};
 生成的校验器: {"a":"number","b":"string","c":{"a":"number","b":"string"}}
 
    // 注意 所有的校验器和元素具有一样的树结构;
 ```
  注意 所有的校验器和元素具有一样的树结构;
###  增加校验器的声明
为了方便解耦合 ,增加了声明校验器的方法, 用字符串代替重复的校验器
例如
```javascript
checkObj.delChecker("a4")

checkObj.addChecker("a4",/a{4}/)
checkObj.checkObj("aaaa1","a4")
```


### 函数式校验
```javascript
//对于对象{a:val} 校验器为：{a:function(val,key){ }}  
//回调参数为(val,"a") //值和键
var result=checkObj([4,3,2,1],[function (val,key) {// 逆序检测
    console.log("依次检测"+val+":"+key);
    return val+key===4
}]);
console.log("[4,3,2,1] 函数检验"+result);
```

 该功能检测到的每个数组的值和键 ,并检测是不是值和键 总值为4;;
```javascript
 var a={"a":2,"b":[3,6,9]};
var checkFunc = {
    a: function (val) {
        return val % 2 === 0;
    }, b: [
        function (val) {
            return val % 3 === 0;
        }
    ]
};

console.log(JSON.stringify(a)+":"+checkObj(a,checkFunc));// true  函数 检测 数据
console.log(JSON.stringify(a.b)+":"+checkObj(a.b,checkFunc.b));// true 函数 检测 数据
```
### 数组校验
检测整个数组是不是都为 数值
`console.log([3,7,8]+":"+checkObj([3,7,8],["number"]));// true  数组 ,检测器为数组 `

### 其他例子

```javascript
var checker = {
    "a": "undefined", "b": "number",c:""
};
var checker1 = {
    "a": "undefined", "b": "number",c:"",d:{
        "a": "undefined", "b": "number",c:""
    }
};


console.log("空字符串匹配任意类型(false, undefined 不允许设值):"+checkObj({a:"555",b:555,c:undefined},checker));

console.log("默认不允许扩展属性(false):"+checkObj({a:undefined,b:555,c:"test String",d:{a:undefined,b:555,c:"num"}},checker));//false
console.log("正常测试用例（true）"+checkObj({a:undefined,b:555,c:"test String",d:{a:undefined,b:555,c:"num"}},checker1));//true
console.log("正常测试用例（true）"+checkObj({a:undefined,b:555,c:"test String"},checker));//true
console.log("类型错误（false）"+checkObj({a:555,b:"555",c:undefined},checker));
```


console.log("检测val,key  函数检测器");


###自动生成校验器
```javascript
var dat=[{a:20,b:"asdhasud"},{a:20,b:"asdhasud"},{a:20,b:"asdhasud"}];
console.log(gen_checker(dat));
```
 生成校验器: [{"a":"number","b":"string"}]
```javascript
 dat={a:20,b:"asdhasud",c:{a:20,b:"asdhasud"}};
console.log(gen_checker(dat));//{ a: 'number', b: 'string', c: { a: 'number', b: 'string' } }
```
 生成校验器: {"a":"number","b":"string","c":{"a":"number","b":"string"}}

```javascript
var dat=[{a:20,b:"asdhasud"},{a:20,b:"asdhasud"},{a:20,b:"asdhasud"}];
console.log(gen_checker(dat));  //  [ { a: 'number', b: 'string' } ]
``` 

 生成校验器:[ { a: 'number', b: 'string' } ]

### 生成动态ts 

根据运行中的 对象 生成类型定义 ;方便使用时查询

例子
```javascript
require("checkobj").gentsDoc(Object.prototype)
{__defineGetter__:()=>any;
__defineSetter__:()=>any;
hasOwnProperty:()=>any;
__lookupGetter__:()=>any;
__lookupSetter__:()=>any;
isPrototypeOf:()=>any;
propertyIsEnumerable:()=>any;
toString:()=>any;
valueOf:()=>any;
toLocaleString:()=>any}

require("checkobj").gentsDoc(require("parameter").prototype)
///结果 class Object//
{t:()=>any;
validate:(rules, obj)=>any;
addRule:(type, check)=>any}
```