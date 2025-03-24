const { checkObj, addChecker, delChecker, sym } = require('../ncheckObj');

describe('checkObj', () => {
  it('should pass function check', () => {
    const checker = (val) => val === 42;
    const result = checkObj(42, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail function check', () => {
    const checker = (val) => val === 42;
    const result = checkObj(43, checker);
    expect(result).toEqual({ success: false, error: "Function check failed", value: 43, property: "" });
  });

  it('should pass array check with single checker', () => {
    const checker = [(val) => val % 2 === 0];
    const result = checkObj([2, 4, 6], checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail array check with single checker', () => {
    const checker = [(val) => val % 2 === 0];
    const result = checkObj([2, 3, 6], checker);
    expect(result).toEqual({ success: false, error: "Array check failed", index: 1, value: 3, reason: false });
  });

  it('should pass array check with multiple checkers', () => {
    const checker = [(val) => val === 1, (val) => val === 2, (val) => val === 3];
    const result = checkObj([1, 2, 3], checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail array check with multiple checkers', () => {
    const checker = [(val) => val === 1, (val) => val === 2, (val) => val === 3];
    const result = checkObj([1, 2, 4], checker);
    expect(result).toEqual({ success: false, error: "Array element check failed", index: 2, value: 4, reason: { success: false, error: "Function check failed", value: 4, property: "[2]" } });
  });

  it('should pass string type check', () => {
    const result = checkObj("hello", "string");
    expect(result).toEqual({ success: true });
  });

  it('should fail string type check', () => {
    const result = checkObj(42, "string");
    expect(result).toEqual({ success: false, error: "Type mismatch", expected: "string", actual: "number" });
  });

  it('should pass RegExp check', () => {
    const checker = /^hello/;
    const result = checkObj("hello world", checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail RegExp check', () => {
    const checker = /^hello/;
    const result = checkObj("world hello", checker);
    expect(result).toEqual({ success: false, error: "RegExp check failed", value: "world hello" });
  });

  it('should pass object check', () => {
    const checker = { a: "number", b: "string" };
    const result = checkObj({ a: 42, b: "hello" }, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail object check with missing property', () => {
    const checker = { a: "number", b: "string" };
    const result = checkObj({ a: 42 }, checker);
    expect(result).toEqual({ success: false, error: "Missing property", property: ".b" });
  });

  it('should fail object check with unexpected property', () => {
    const checker = { a: "number" };
    const result = checkObj({ a: 42, b: "hello" }, checker);
    expect(result).toEqual({ success: false, error: "Unexpected property", property: "b" });
  });

  it('should pass nested object check', () => {
    const checker = { a: { b: "number" } };
    const result = checkObj({ a: { b: 42 } }, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail nested object check', () => {
    const checker = { a: { b: "number" } };
    const result = checkObj({ a: { b: "hello" } }, checker);
    expect(result).toEqual({ success: false, error: "Property check failed", property: ".a.b", value: "hello", reason: { success: false, error: "Type mismatch", expected: "number", actual: "string" } });
  });

  it('should pass custom checker', () => {
    addChecker("even", (val) => val % 2 === 0);
    const result = checkObj(4, "even");
    expect(result).toEqual({ success: true });
    delChecker("even");
  });

  it('should fail custom checker', () => {
    addChecker("even", (val) => val % 2 === 0);
    const result = checkObj(5, "even");
    expect(result).toEqual({ success: false, error: "Function check failed", value: 5, property: "" });
    delChecker("even");
  });

  it('should pass with expand symbol', () => {
    const checker = { a: "number", [sym.expand]: true };
    const result = checkObj({ a: 42, b: "hello" }, checker);
    expect(result).toEqual({ success: true });
  });
});