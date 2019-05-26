/**
 * 允许有函数键 数组键  ； 过滤
 * @param {Object} obj 要修剪的对象
 * @param {any} checker  检查器
 * @return   过滤结果
 */
function filte(obj, checker) {// 允许有函数键 数组键  ； 过滤
    if (!obj && obj.constructor != Object) return null;
    if (checker.constructor === Function) return checker(obj);// 过滤函数
    if (checker.constructor === Array) { //数组校验
        if (obj.constructor !== Array) return null;
        var arr = obj;
        if (checker.length === 1) { //长度为1可以 作为整个数组的检测
            var ck_arr0 = checker[0];
            var resDat = [];
            for (var i1 = 0, len4 = arr.length; i1 < len4; i1++) {// 校验数组
                if (ck_arr0.constructor === Function)
                    resDat[i1] = ck_arr0(arr[i1], i1);//函数校验器 可以允许有 传当前val 以及 key
                else
                    resDat[i1] = arguments.callee(arr[i1], ck_arr0);
            }
        }
        else if (checker.length > 1) {//长度为大于1 每个数组分开检测
            if (checker.length !== obj.length)
                return false;
            var resDat = [];
            for (var i2 = 0, len2 = arr.length; i2 < len2; i2++) {
                resDat[i2] = arguments.callee(arr[i2], checker[i2]);
            }
            return resDat
        }
        return true;
    }
    else if (checker.constructor === String) {
        if (checker !== "") {
            return typeof obj === checker.toLowerCase() ? obj : null
        }
        else return obj
    }
    var coll = {};
    for (var key in checker) {
        coll[key] = arguments.callee(obj[key], checker[key]);
    }
}
module.exports.filte = filte;