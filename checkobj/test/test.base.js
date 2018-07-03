var assert=require("assert");
var checkobj=require("../index");
assert.strictEqual(checkobj.checkObj(true,"boolean"),true);
assert.strictEqual(checkobj.checkObj(false,"string"),false);
assert.strictEqual(checkobj.checkObj(1,"number"),true);
assert.strictEqual(checkobj.checkObj(null,"object"),true);
assert.strictEqual(checkobj.checkObj({},"object"),true);

assert.strictEqual(checkobj.checkObj([],"array"),true);
// assert.strictEqual(checkobj.checkObj({},"array"),false);