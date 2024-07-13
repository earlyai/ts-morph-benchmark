
// Unit tests for: binaryInsertWithOverwrite

import { Comparer } from "../../comparers";

import { ArrayUtils } from '../ArrayUtils';


class NumberComparer implements Comparer<number> {
  compareTo(a: number, b: number): number {
    return a - b;
  }
}

describe('ArrayUtils.binaryInsertWithOverwrite() binaryInsertWithOverwrite method', () => {
  let comparer: NumberComparer;

  beforeEach(() => {
    comparer = new NumberComparer();
  });

  describe('Happy Path', () => {
    test('should insert a new item into an empty array', () => {
      const items: number[] = [];
      const newItem = 5;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([5]);
    });

    test('should insert a new item into a sorted array at the correct position', () => {
      const items = [1, 3, 7, 9];
      const newItem = 5;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([1, 3, 5, 7, 9]);
    });

    test('should overwrite an existing item if it matches the new item', () => {
      const items = [1, 3, 5, 7, 9];
      const newItem = 5;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([1, 3, 5, 7, 9]);
    });

    test('should insert a new item at the beginning of the array', () => {
      const items = [2, 3, 4];
      const newItem = 1;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([1, 2, 3, 4]);
    });

    test('should insert a new item at the end of the array', () => {
      const items = [1, 2, 3];
      const newItem = 4;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Edge Cases', () => {
    test('should handle inserting into an array with one element', () => {
      const items = [2];
      const newItem = 1;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([1, 2]);
    });

    test('should handle inserting a duplicate item into an array with one element', () => {
      const items = [2];
      const newItem = 2;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([2]);
    });

    test('should handle inserting into an array with all identical elements', () => {
      const items = [2, 2, 2];
      const newItem = 2;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([2, 2, 2]);
    });

    test('should handle inserting a new item that is smaller than all existing items', () => {
      const items = [2, 3, 4];
      const newItem = 1;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([1, 2, 3, 4]);
    });

    test('should handle inserting a new item that is larger than all existing items', () => {
      const items = [1, 2, 3];
      const newItem = 4;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([1, 2, 3, 4]);
    });

    test('should handle inserting a new item into an array with negative numbers', () => {
      const items = [-3, -1, 1, 3];
      const newItem = -2;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([-3, -2, -1, 1, 3]);
    });

    test('should handle inserting a new item into an array with mixed positive and negative numbers', () => {
      const items = [-3, -1, 1, 3];
      const newItem = 0;

      ArrayUtils.binaryInsertWithOverwrite(items, newItem, comparer);

      expect(items).toEqual([-3, -1, 0, 1, 3]);
    });
  });
});

// End of unit tests for: binaryInsertWithOverwrite
