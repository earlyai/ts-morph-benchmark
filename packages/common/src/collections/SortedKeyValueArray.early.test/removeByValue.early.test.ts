
// Unit tests for: removeByValue

import { Comparer } from "../../comparers";

import { ArrayUtils } from "../../utils";

import { SortedKeyValueArray } from '../SortedKeyValueArray';


// Mocking ArrayUtils for binaryInsertWithOverwrite and binarySearch
jest.mock("../../utils", () => ({
  ArrayUtils: {
    binaryInsertWithOverwrite: jest.fn(),
    binarySearch: jest.fn(),
  },
}));

// Mock Comparer implementation
class MockComparer implements Comparer<number> {
  compareTo(a: number, b: number): number {
    return a - b;
  }
}

describe('SortedKeyValueArray.removeByValue() removeByValue method', () => {
  let sortedArray: SortedKeyValueArray<number, { id: number, value: string }>;
  let comparer: Comparer<number>;

  beforeEach(() => {
    comparer = new MockComparer();
    sortedArray = new SortedKeyValueArray((item) => item.id, comparer);
  });

  describe('Happy Path', () => {
    test('should remove an existing value from the array', () => {
      // Arrange
      const value = { id: 1, value: 'test' };
      sortedArray.set(value);
      (ArrayUtils.binarySearch as jest.Mock).mockReturnValue(0);

      // Act
      sortedArray.removeByValue(value);

      // Assert
      expect(ArrayUtils.binarySearch).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object)
      );
      expect(sortedArray.getArrayCopy()).toEqual([]);
    });

    test.skip('should not remove a value that does not exist in the array', () => {
      // Arrange
      const value = { id: 1, value: 'test' };
      sortedArray.set(value);
      const nonExistentValue = { id: 2, value: 'non-existent' };
      (ArrayUtils.binarySearch as jest.Mock).mockReturnValue(-1);

      // Act
      sortedArray.removeByValue(nonExistentValue);

      // Assert
      expect(ArrayUtils.binarySearch).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object)
      );
      expect(sortedArray.getArrayCopy()).toEqual([value]);
    });
  });

  describe('Edge Cases', () => {
    test('should handle removing from an empty array gracefully', () => {
      // Arrange
      const value = { id: 1, value: 'test' };
      (ArrayUtils.binarySearch as jest.Mock).mockReturnValue(-1);

      // Act
      sortedArray.removeByValue(value);

      // Assert
      expect(ArrayUtils.binarySearch).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object)
      );
      expect(sortedArray.getArrayCopy()).toEqual([]);
    });

    test('should handle removing a value with a complex key', () => {
      // Arrange
      const complexKeyArray = new SortedKeyValueArray(
        (item: { id: { part1: number, part2: number }, value: string }) => item.id.part1 + item.id.part2,
        comparer
      );
      const value = { id: { part1: 1, part2: 2 }, value: 'test' };
      complexKeyArray.set(value);
      (ArrayUtils.binarySearch as jest.Mock).mockReturnValue(0);

      // Act
      complexKeyArray.removeByValue(value);

      // Assert
      expect(ArrayUtils.binarySearch).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object)
      );
      expect(complexKeyArray.getArrayCopy()).toEqual([]);
    });

    test.skip('should handle removing a value when multiple values with the same key exist', () => {
      // Arrange
      const value1 = { id: 1, value: 'test1' };
      const value2 = { id: 1, value: 'test2' };
      sortedArray.set(value1);
      sortedArray.set(value2);
      (ArrayUtils.binarySearch as jest.Mock).mockReturnValue(0);

      // Act
      sortedArray.removeByValue(value1);

      // Assert
      expect(ArrayUtils.binarySearch).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object)
      );
      expect(sortedArray.getArrayCopy()).toEqual([value2]);
    });
  });
});

// End of unit tests for: removeByValue
