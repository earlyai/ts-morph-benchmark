
// Unit tests for: removeFirst


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.removeFirst() removeFirst method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should remove the first occurrence of the item from the array', () => {
      const array = [1, 2, 3, 4, 2];
      const itemToRemove = 2;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(true);
      expect(array).toEqual([1, 3, 4, 2]);
    });

    test('should return true when the item is successfully removed', () => {
      const array = ['a', 'b', 'c'];
      const itemToRemove = 'b';
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(true);
      expect(array).toEqual(['a', 'c']);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false when the item is not found in the array', () => {
      const array = [1, 2, 3];
      const itemToRemove = 4;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(false);
      expect(array).toEqual([1, 2, 3]);
    });

    test('should handle an empty array gracefully', () => {
      const array: number[] = [];
      const itemToRemove = 1;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(false);
      expect(array).toEqual([]);
    });

    test('should handle an array with a single element that matches the item', () => {
      const array = [1];
      const itemToRemove = 1;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(true);
      expect(array).toEqual([]);
    });

    test('should handle an array with a single element that does not match the item', () => {
      const array = [1];
      const itemToRemove = 2;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(false);
      expect(array).toEqual([1]);
    });

    test('should handle an array with multiple identical elements', () => {
      const array = [1, 1, 1, 1];
      const itemToRemove = 1;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(true);
      expect(array).toEqual([1, 1, 1]);
    });

    test('should handle an array with different types of elements', () => {
      const array = [1, 'a', true, null];
      const itemToRemove = 'a';
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(true);
      expect(array).toEqual([1, true, null]);
    });

    test('should handle an array with undefined elements', () => {
      const array = [undefined, 1, 2];
      const itemToRemove = undefined;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(true);
      expect(array).toEqual([1, 2]);
    });

    test('should handle an array with null elements', () => {
      const array = [null, 1, 2];
      const itemToRemove = null;
      const result = ArrayUtils.removeFirst(array, itemToRemove);
      expect(result).toBe(true);
      expect(array).toEqual([1, 2]);
    });
  });
});

// End of unit tests for: removeFirst
