const {checkObj} = require('../ncheckObj');
// const checker = [(val) => val % 2 === 0];
// const result = checkObj([2, 4, 6], checker);
// console.log(result);

const checker = { a: "number", b: "string" };
const result = checkObj({ a: 42, b: "hello" }, checker);
console.log(result);
