var assert=require("assert");
var checkObj=require("../index");

checkObj.addChecker("a4",/a{4}/)//"aaaa1",/a{4}/

assert.strictEqual(checkObj.checkObj("aaaa1","a4"),true);
assert.strictEqual(checkObj.checkObj("aaa1","a4"),false);

checkObj.delChecker("a4")//"aaaa1",/a{4}/

checkObj.addChecker("a4",/a{4}/)//"aaaa1",/a{4}/

assert.strictEqual(checkObj.checkObj("aaaa1","a4"),true);
assert.strictEqual(checkObj.checkObj("aaa1","a4"),false);
