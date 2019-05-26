var { funcString } = require("./funcString")
console.log(funcString(async => { }));
console.log(funcString(async () => { }));
console.log(funcString(() => { }));
console.log(funcString(function* () { }));
console.log(funcString((a) => { }))