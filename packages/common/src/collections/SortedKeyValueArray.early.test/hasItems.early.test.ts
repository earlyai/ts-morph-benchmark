
// Unit tests for: hasItems

import { Comparer } from "../../comparers";


import { SortedKeyValueArray } from '../SortedKeyValueArray';


class NumberComparer implements Comparer<number> {
  compareTo(a: number, b: number): number {
    return a - b;
  }
}

describe('SortedKeyValueArray.hasItems() hasItems method', () => {
  let sortedArray: SortedKeyValueArray<number, number>;
  let comparer: Comparer<number>;

  beforeEach(() => {
    comparer = new NumberComparer();
    sortedArray = new SortedKeyValueArray<number, number>((value) => value, comparer);
  });

  describe('Happy Path', () => {
    test('should return false for an empty array', () => {
      // Test to ensure hasItems returns false when the array is empty
      expect(sortedArray.hasItems()).toBe(false);
    });

    test('should return true when there is one item in the array', () => {
      // Test to ensure hasItems returns true when there is one item in the array
      sortedArray.set(1);
      expect(sortedArray.hasItems()).toBe(true);
    });

    test('should return true when there are multiple items in the array', () => {
      // Test to ensure hasItems returns true when there are multiple items in the array
      sortedArray.set(1);
      sortedArray.set(2);
      sortedArray.set(3);
      expect(sortedArray.hasItems()).toBe(true);
    });

    test('should return false after removing the only item in the array', () => {
      // Test to ensure hasItems returns false after removing the only item in the array
      sortedArray.set(1);
      sortedArray.removeByValue(1);
      expect(sortedArray.hasItems()).toBe(false);
    });

    test('should return true after removing one of multiple items in the array', () => {
      // Test to ensure hasItems returns true after removing one of multiple items in the array
      sortedArray.set(1);
      sortedArray.set(2);
      sortedArray.set(3);
      sortedArray.removeByValue(2);
      expect(sortedArray.hasItems()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should return false for an array that was never populated', () => {
      // Test to ensure hasItems returns false for an array that was never populated
      expect(sortedArray.hasItems()).toBe(false);
    });

    test('should return true for an array with duplicate items', () => {
      // Test to ensure hasItems returns true for an array with duplicate items
      sortedArray.set(1);
      sortedArray.set(1);
      expect(sortedArray.hasItems()).toBe(true);
    });

    test('should return false after clearing all items from the array', () => {
      // Test to ensure hasItems returns false after clearing all items from the array
      sortedArray.set(1);
      sortedArray.set(2);
      sortedArray.set(3);
      sortedArray.removeByValue(1);
      sortedArray.removeByValue(2);
      sortedArray.removeByValue(3);
      expect(sortedArray.hasItems()).toBe(false);
    });

    test('should handle large number of items correctly', () => {
      // Test to ensure hasItems handles a large number of items correctly
      for (let i = 0; i < 1000; i++) {
        sortedArray.set(i);
      }
      expect(sortedArray.hasItems()).toBe(true);
    });

    test('should return true after removing and adding items repeatedly', () => {
      // Test to ensure hasItems returns true after removing and adding items repeatedly
      sortedArray.set(1);
      sortedArray.removeByValue(1);
      sortedArray.set(2);
      sortedArray.removeByValue(2);
      sortedArray.set(3);
      expect(sortedArray.hasItems()).toBe(true);
    });
  });
});

// End of unit tests for: hasItems
