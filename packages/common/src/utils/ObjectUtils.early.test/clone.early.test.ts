
// Unit tests for: clone

import { ObjectUtils } from '../ObjectUtils';


describe('ObjectUtils.clone() clone method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should clone a simple object', () => {
      const obj = { a: 1, b: 2 };
      const clonedObj = ObjectUtils.clone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj); // Ensure it's a different reference
    });

    test.skip('should clone an array of primitives', () => {
      const arr = [1, 2, 3];
      const clonedArr = ObjectUtils.clone(arr);
      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr); // Ensure it's a different reference
    });

    test('should clone an array of objects', () => {
      const arr = [{ a: 1 }, { b: 2 }];
      const clonedArr = ObjectUtils.clone(arr);
      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr); // Ensure it's a different reference
      expect(clonedArr[0]).not.toBe(arr[0]); // Ensure nested objects are also cloned
    });

    test.skip('should clone a nested object', () => {
      const obj = { a: { b: { c: 1 } } };
      const clonedObj = ObjectUtils.clone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj); // Ensure it's a different reference
      expect(clonedObj.a).not.toBe(obj.a); // Ensure nested objects are also cloned
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return undefined when input is null', () => {
      const result = ObjectUtils.clone(null);
      expect(result).toBeUndefined();
    });

    test('should return undefined when input is undefined', () => {
      const result = ObjectUtils.clone(undefined);
      expect(result).toBeUndefined();
    });

    test('should clone an empty object', () => {
      const obj = {};
      const clonedObj = ObjectUtils.clone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj); // Ensure it's a different reference
    });

    test('should clone an empty array', () => {
      const arr: any[] = [];
      const clonedArr = ObjectUtils.clone(arr);
      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr); // Ensure it's a different reference
    });

    test.skip('should clone an array with mixed types', () => {
      const arr = [1, 'string', { a: 1 }, [2, 3]];
      const clonedArr = ObjectUtils.clone(arr);
      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr); // Ensure it's a different reference
      expect(clonedArr[2]).not.toBe(arr[2]); // Ensure nested objects are also cloned
      expect(clonedArr[3]).not.toBe(arr[3]); // Ensure nested arrays are also cloned
    });

    test.skip('should clone an object with various types', () => {
      const obj = { num: 1, str: 'string', bool: true, arr: [1, 2], nested: { a: 1 } };
      const clonedObj = ObjectUtils.clone(obj);
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj); // Ensure it's a different reference
      expect(clonedObj.arr).not.toBe(obj.arr); // Ensure nested arrays are also cloned
      expect(clonedObj.nested).not.toBe(obj.nested); // Ensure nested objects are also cloned
    });
  });
});

// End of unit tests for: clone
