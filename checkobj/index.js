module.exports=require("./checkObj");
module.exports.filte=require("./filte").filte;
module.exports.transFunc=require("./transFunc");
mix(require("./genDoc"));
function mix(mixObj) {
    for (const key in mixObj) {
        if (mixObj.hasOwnProperty(key)) {
            module.exports[key] = mixObj[key];   
        }
    }
}
