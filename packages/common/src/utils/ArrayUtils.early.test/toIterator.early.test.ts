
// Unit tests for: toIterator


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.toIterator() toIterator method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should iterate over all elements in a non-empty array', () => {
      const items = [1, 2, 3, 4, 5];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });

    test('should iterate over all elements in an array of strings', () => {
      const items = ['a', 'b', 'c'];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });

    test('should iterate over all elements in an array of objects', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle an empty array', () => {
      const items: number[] = [];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });

    test('should handle an array with a single element', () => {
      const items = [42];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });

    test('should handle an array with mixed types', () => {
      const items = [1, 'a', { id: 2 }];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });

    test('should handle an array with undefined elements', () => {
      const items = [undefined, 1, undefined, 2];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });

    test('should handle an array with null elements', () => {
      const items = [null, 1, null, 2];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });

    test('should handle an array with NaN elements', () => {
      const items = [NaN, 1, NaN, 2];
      const iterator = ArrayUtils.toIterator(items);
      const result = Array.from(iterator);
      expect(result).toEqual(items);
    });
  });
});

// End of unit tests for: toIterator
