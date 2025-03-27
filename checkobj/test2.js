const { checkObj, addChecker, delChecker, sym } = require('./ncheckObj');
const schema = {
    [sym.keys]: (key) => ["name", "age"].includes(key),
};
var d = checkObj({ name: "Alice", age: 25 }, schema)

console.log(d)

var d1 = checkObj({ name: "Alice", gender: "female" }, schema)
console.log(d1)



const schema1 = {
    [sym.values]: (value) => typeof value === "string",
  };

var d3 = checkObj({ name: "Alice", city: "New York" }, schema1);
var d4 =checkObj({ name: "Alice", age: 25 }, schema1);

console.log(d3);
console.log(d4);