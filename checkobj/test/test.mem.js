var assert=require("assert");
var checkobj=require("../index");

checkobj.addChecker("a4",/a{4}/)//"aaaa1",/a{4}/

assert.strictEqual(checkobj.checkObj("aaaa1","a4"),true);
assert.strictEqual(checkobj.checkObj("aaa1","a4"),false);

checkobj.delChecker("a4")

checkobj.addChecker("a4",/a{4}/)

assert.strictEqual(checkobj.checkObj("aaaa1","a4"),true);
assert.strictEqual(checkobj.checkObj("aaa1","a4"),false);


// assert.strictEqual(checkobj.checkObj({key:"aaaa1"},{key:/a{4}/}),true);
assert.equal(checkobj.checkObj({key:"aaaa1"},{key:/a{4}/}),true,"二级子兼异常");

assert.equal(checkobj.checkObj({key:"aa1"},{key:/a{4}/}),false,"二级子兼异常");