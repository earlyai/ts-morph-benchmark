
// Unit tests for: containsSubArray


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.containsSubArray() containsSubArray method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true when subArray is found within items', () => {
      const items = [1, 2, 3, 4, 5];
      const subArray = [2, 3, 4];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(true);
    });

    test('should return true when subArray is found at the beginning of items', () => {
      const items = [1, 2, 3, 4, 5];
      const subArray = [1, 2, 3];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(true);
    });

    test('should return true when subArray is found at the end of items', () => {
      const items = [1, 2, 3, 4, 5];
      const subArray = [3, 4, 5];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(true);
    });

    test('should return true when subArray is the same as items', () => {
      const items = [1, 2, 3, 4, 5];
      const subArray = [1, 2, 3, 4, 5];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(true);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false when subArray is not found within items', () => {
      const items = [1, 2, 3, 4, 5];
      const subArray = [6, 7, 8];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(false);
    });

    test('should return false when subArray is longer than items', () => {
      const items = [1, 2, 3];
      const subArray = [1, 2, 3, 4];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(false);
    });

    test.skip('should return true when subArray is empty', () => {
      const items = [1, 2, 3, 4, 5];
      const subArray: number[] = [];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(true);
    });

    test.skip('should return true when both items and subArray are empty', () => {
      const items: number[] = [];
      const subArray: number[] = [];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(true);
    });

    test('should return false when items is empty and subArray is not', () => {
      const items: number[] = [];
      const subArray = [1, 2, 3];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(false);
    });

    test('should handle case sensitivity correctly', () => {
      const items = ['a', 'b', 'c', 'D', 'e'];
      const subArray = ['b', 'c', 'd'];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(false);
    });

    test('should return true when subArray is found with repeated elements', () => {
      const items = [1, 2, 2, 3, 4];
      const subArray = [2, 2, 3];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(true);
    });

    test('should return false when subArray is partially found but not in sequence', () => {
      const items = [1, 2, 3, 4, 5];
      const subArray = [2, 4];
      expect(ArrayUtils.containsSubArray(items, subArray)).toBe(false);
    });
  });
});

// End of unit tests for: containsSubArray
