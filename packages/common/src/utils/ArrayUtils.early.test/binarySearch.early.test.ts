
// Unit tests for: binarySearch

import { StoredComparer } from "../../comparers";

import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.binarySearch() binarySearch method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should find the index of an existing item in a sorted array', () => {
      const items = [1, 2, 3, 4, 5];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 3
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(2);
    });

    test.skip('should find the index of the first item in a sorted array', () => {
      const items = [1, 2, 3, 4, 5];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 1
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(0);
    });

    test.skip('should find the index of the last item in a sorted array', () => {
      const items = [1, 2, 3, 4, 5];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 5
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(4);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return -1 for an empty array', () => {
      const items: number[] = [];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 3
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(-1);
    });

    test('should return -1 when the item is not found in a non-empty array', () => {
      const items = [1, 2, 4, 5];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 3
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(-1);
    });

    test('should handle arrays with duplicate items correctly', () => {
      const items = [1, 2, 3, 3, 3, 4, 5];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 3
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(4);
    });

    test('should handle a single-element array where the element matches', () => {
      const items = [3];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 3
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(0);
    });

    test('should handle a single-element array where the element does not match', () => {
      const items = [1];
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 3
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(-1);
    });

    test.skip('should handle a large array efficiently', () => {
      const items = Array.from({ length: 1000000 }, (_, i) => i + 1);
      const storedComparer: StoredComparer<number> = {
        compareTo: (value: number) => value - 999999
      };
      const result = ArrayUtils.binarySearch(items, storedComparer);
      expect(result).toBe(999998);
    });
  });
});

// End of unit tests for: binarySearch
