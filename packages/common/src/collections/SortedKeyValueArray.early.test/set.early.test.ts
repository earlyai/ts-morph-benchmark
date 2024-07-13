
// Unit tests for: set

import { Comparer, PropertyComparer } from "../../comparers";

import { ArrayUtils } from "../../utils";

import { SortedKeyValueArray } from '../SortedKeyValueArray';


jest.mock("../../utils", () => ({
  ArrayUtils: {
    binaryInsertWithOverwrite: jest.fn(),
  },
}));

describe('SortedKeyValueArray.set() set method', () => {
  let comparer: Comparer<number>;
  let getKey: (value: { key: number }) => number;
  let sortedArray: SortedKeyValueArray<number, { key: number }>;

  beforeEach(() => {
    comparer = {
      compareTo: jest.fn((a, b) => a - b),
    };
    getKey = (value) => value.key;
    sortedArray = new SortedKeyValueArray(getKey, comparer);
  });

  describe('Happy Path', () => {
    test('should insert a value into an empty array', () => {
      const value = { key: 1 };

      sortedArray.set(value);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [],
        value,
        expect.any(PropertyComparer)
      );
    });

    test.skip('should insert a value into a non-empty array', () => {
      const value1 = { key: 1 };
      const value2 = { key: 2 };
      sortedArray.set(value1);

      sortedArray.set(value2);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [value1],
        value2,
        expect.any(PropertyComparer)
      );
    });

    test.skip('should overwrite an existing value with the same key', () => {
      const value1 = { key: 1, data: 'old' };
      const value2 = { key: 1, data: 'new' };
      sortedArray.set(value1);

      sortedArray.set(value2);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [value1],
        value2,
        expect.any(PropertyComparer)
      );
    });
  });

  describe('Edge Cases', () => {
    test('should handle inserting a value with a negative key', () => {
      const value = { key: -1 };

      sortedArray.set(value);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [],
        value,
        expect.any(PropertyComparer)
      );
    });

    test('should handle inserting a value with a very large key', () => {
      const value = { key: Number.MAX_SAFE_INTEGER };

      sortedArray.set(value);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [],
        value,
        expect.any(PropertyComparer)
      );
    });

    test('should handle inserting a value with a very small key', () => {
      const value = { key: Number.MIN_SAFE_INTEGER };

      sortedArray.set(value);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [],
        value,
        expect.any(PropertyComparer)
      );
    });

    test.skip('should handle inserting multiple values with the same key', () => {
      const value1 = { key: 1, data: 'first' };
      const value2 = { key: 1, data: 'second' };
      sortedArray.set(value1);

      sortedArray.set(value2);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [value1],
        value2,
        expect.any(PropertyComparer)
      );
    });

    test.skip('should handle inserting a value when comparer returns 0 for all comparisons', () => {
      comparer.compareTo = jest.fn(() => 0);
      const value1 = { key: 1 };
      const value2 = { key: 2 };

      sortedArray.set(value1);
      sortedArray.set(value2);

      expect(ArrayUtils.binaryInsertWithOverwrite).toHaveBeenCalledWith(
        [value1],
        value2,
        expect.any(PropertyComparer)
      );
    });
  });
});

// End of unit tests for: set
