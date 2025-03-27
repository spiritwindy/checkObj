// ...existing code...
describe('checkObj function tests', () => {
  it('should pass object check with specific keys and values', () => {
    const checker = { key1: "string", key2: "number" };
    const result = checkObj({ key1: "value", key2: 123 }, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail object check with incorrect value type', () => {
    const checker = { key1: "string", key2: "number" };
    const result = checkObj({ key1: "value", key2: "not a number" }, checker);
    expect(result).toEqual({ success: false, error: "Type mismatch", expected: "number", actual: "string" });
  });

  it('should fail object check with missing key', () => {
    const checker = { key1: "string", key2: "number" };
    const result = checkObj({ key1: "value" }, checker);
    expect(result).toEqual({ success: false, error: "Missing property", property: ".key2" });
  });

  it('should pass object check with nested keys and values', () => {
    const checker = { nested: { key1: "string", key2: "boolean" } };
    const result = checkObj({ nested: { key1: "value", key2: true } }, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail object check with incorrect nested value type', () => {
    const checker = { nested: { key1: "string", key2: "boolean" } };
    const result = checkObj({ nested: { key1: "value", key2: "not a boolean" } }, checker);
    expect(result).toEqual({ success: false, error: "Property check failed", property: ".nested.key2", value: "not a boolean", reason: { success: false, error: "Type mismatch", expected: "boolean", actual: "string" } });
  });

  it('should pass object check with additional properties when expand is true', () => {
    const checker = { key1: "string", [sym.expand]: true };
    const result = checkObj({ key1: "value", extraKey: 123 }, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail object check with additional properties when expand is false', () => {
    const checker = { key1: "string" };
    const result = checkObj({ key1: "value", extraKey: 123 }, checker);
    expect(result).toEqual({ success: false, error: "Unexpected property", property: "extraKey" });
  });

  it('should pass object check with unrequired keys', () => {
    const checker = { key1: "string", key2: sym.unrequired };
    const result = checkObj({ key1: "value" }, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail object check when required key is missing', () => {
    const checker = { key1: "string", key2: "number" };
    const result = checkObj({ key2: 123 }, checker);
    expect(result).toEqual({ success: false, error: "Missing property", property: ".key1" });
  });

  it('should pass object check with custom function for key validation', () => {
    const checker = { key1: (val) => val.startsWith("val") };
    const result = checkObj({ key1: "value" }, checker);
    expect(result).toEqual({ success: true });
  });

  it('should fail object check with custom function for key validation', () => {
    const checker = { key1: (val) => val.startsWith("val") };
    const result = checkObj({ key1: "wrong" }, checker);
    expect(result).toEqual({ success: false, error: "Function check failed", property: ".key1", value: "wrong" });
  });
});
// ...existing code...
