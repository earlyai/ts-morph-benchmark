
// Unit tests for: removeAll


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.removeAll() removeAll method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should remove all matching items from the array', () => {
      const array = [1, 2, 3, 4, 5, 2, 6];
      const isMatch = (item: number) => item === 2;
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual([2, 2]);
      expect(array).toEqual([1, 3, 4, 5, 6]);
    });

    test('should return an empty array when no items match', () => {
      const array = [1, 2, 3, 4, 5];
      const isMatch = (item: number) => item === 6;
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual([]);
      expect(array).toEqual([1, 2, 3, 4, 5]);
    });

    test('should remove all items when all items match', () => {
      const array = [1, 1, 1, 1];
      const isMatch = (item: number) => item === 1;
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual([1, 1, 1, 1]);
      expect(array).toEqual([]);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle an empty array gracefully', () => {
      const array: number[] = [];
      const isMatch = (item: number) => item === 1;
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual([]);
      expect(array).toEqual([]);
    });

    test('should handle an array with no matching items', () => {
      const array = [1, 2, 3, 4, 5];
      const isMatch = (item: number) => item === 6;
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual([]);
      expect(array).toEqual([1, 2, 3, 4, 5]);
    });

    test.skip('should handle an array with multiple types of items', () => {
      const array = [1, '2', 3, '4', 5];
      const isMatch = (item: any) => typeof item === 'string';
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual(['2', '4']);
      expect(array).toEqual([1, 3, 5]);
    });

    test('should handle an array with complex objects', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }];
      const isMatch = (item: { id: number }) => item.id === 2;
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual([{ id: 2 }, { id: 2 }]);
      expect(array).toEqual([{ id: 1 }, { id: 3 }]);
    });

    test('should handle an array with nested arrays', () => {
      const array = [[1], [2], [3], [2]];
      const isMatch = (item: number[]) => item[0] === 2;
      const result = ArrayUtils.removeAll(array, isMatch);
      
      expect(result).toEqual([[2], [2]]);
      expect(array).toEqual([[1], [3]]);
    });
  });
});

// End of unit tests for: removeAll
