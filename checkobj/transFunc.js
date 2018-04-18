/**
 * 备注转换后原始值回转变
 * @param {Object.<T>} obj 
 * @param {Object} transer 
 * @example     var obj={a:"50",b:20,c:{},d:null} ;  transFunc(obj,{a:Number,b:String}); //可以自己写的转换函数
 * 
 * @returns {{val:Object.<T>,stat:boolean}}
 */
function transFunc(obj, transer) {//可能存在异常的
    var tranStat={stat:false,val:obj};
    for (var k in transer) {
        if (obj.hasOwnProperty(k)) {
            if (obj[k] == undefined || obj[k] == null || transer[k] == null || transer[k] == undefined)
                return tranStat;
            if (transer[k].constructor == Function) {
                obj[k] = transer[k](obj[k]);//自己确保返回转换后的值
                tranStat.stat=true;
            } else if(transer[k].constructor == Object){
                var transerStat=transFunc(obj[k],transer[k]);
                if(transerStat.stat){
                    obj[k]=transerStat.val;// 没法递归 false
                }else{
                    return tranStat;// 
                } 
            }
        }
        else {
            return tranStat;
        }
    }
    return tranStat;
}
//

/* function test(params) {
    var obj={a:"50",b:20,c:{},d:null};
    transFunc(obj,{a:Number,b:String});
    console.log(obj.val)
    obj={a:"50",b:20,c:{},d:{a:"50",b:20,c:{}}};
    transFunc(obj,{a:Number,b:String,d:{a:Number,b:String}});
  console.log(obj)
}
test();
 */
module.exports = transFunc;