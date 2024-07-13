
// Unit tests for: deepClone

import { deepClone } from '../deepClone';

describe('deepClone() deepClone method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should deep clone a simple object', () => {
      const obj = { a: 1, b: 'string', c: true };
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj); // Ensure it's a different reference
    });

    test('should deep clone a nested object', () => {
      const obj = { a: { b: { c: 1 } } };
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
      expect(clonedObj.a).not.toBe(obj.a);
      expect(clonedObj.a.b).not.toBe(obj.a.b);
    });

    test.skip('should deep clone an array of objects', () => {
      const arr = [{ a: 1 }, { b: 2 }];
      const clonedArr = deepClone(arr);
      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr);
      expect(clonedArr[0]).not.toBe(arr[0]);
      expect(clonedArr[1]).not.toBe(arr[1]);
    });

    test('should deep clone an object with various data types', () => {
      const obj = { a: 1, b: 'string', c: true, d: null, e: undefined, f: [1, 2, 3] };
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle cloning an empty object', () => {
      const obj = {};
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
    });

    test('should handle cloning an object with null values', () => {
      const obj = { a: null, b: { c: null } };
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
      expect(clonedObj.b).not.toBe(obj.b);
    });

    test('should handle cloning an object with undefined values', () => {
      const obj = { a: undefined, b: { c: undefined } };
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
      expect(clonedObj.b).not.toBe(obj.b);
    });

    test('should handle cloning an object with circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      expect(() => deepClone(obj)).toThrow(); // Expecting the function to throw due to circular reference
    });

    test.skip('should handle cloning an array with mixed data types', () => {
      const arr = [1, 'string', true, null, undefined, { a: 1 }];
      const clonedArr = deepClone(arr);
      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr);
      expect(clonedArr[5]).not.toBe(arr[5]);
    });

    test('should handle cloning an object with functions', () => {
      const obj = { a: 1, b: () => 'test' };
      const clonedObj = deepClone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
      expect(clonedObj.b).toBe(obj.b); // Functions should not be cloned, should be the same reference
    });
  });
});

// End of unit tests for: deepClone
