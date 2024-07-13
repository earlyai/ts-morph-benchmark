
// Unit tests for: getUniqueItems


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.getUniqueItems() getUniqueItems method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return unique items from an array of numbers', () => {
      const input = [1, 2, 2, 3, 4, 4, 5];
      const expectedOutput = [1, 2, 3, 4, 5];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });

    test('should return unique items from an array of strings', () => {
      const input = ['a', 'b', 'b', 'c', 'a'];
      const expectedOutput = ['a', 'b', 'c'];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });

    test('should return the same array if all items are unique', () => {
      const input = [1, 2, 3, 4, 5];
      const expectedOutput = [1, 2, 3, 4, 5];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return an empty array when input is an empty array', () => {
      const input: number[] = [];
      const expectedOutput: number[] = [];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });

    test('should handle an array with a single item', () => {
      const input = [1];
      const expectedOutput = [1];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });

    test('should handle an array with all identical items', () => {
      const input = [1, 1, 1, 1, 1];
      const expectedOutput = [1];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });

    test('should handle an array with different types of items', () => {
      const input = [1, '1', 1, '1', true, false, true];
      const expectedOutput = [1, '1', true, false];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });

    test('should handle an array with undefined and null values', () => {
      const input = [undefined, null, undefined, null];
      const expectedOutput = [undefined, null];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });

    test.skip('should handle an array with NaN values', () => {
      const input = [NaN, NaN, 1, 2, NaN];
      const expectedOutput = [NaN, 1, 2];
      expect(ArrayUtils.getUniqueItems(input)).toEqual(expectedOutput);
    });
  });
});

// End of unit tests for: getUniqueItems
