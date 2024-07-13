
// Unit tests for: sortByProperty


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.sortByProperty() sortByProperty method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should sort an array of numbers in ascending order based on the property', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
    });

    test('should sort an array of strings in ascending order based on the property', () => {
      const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.name);
      expect(sortedItems).toEqual([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]);
    });

    test('should handle an array with a single element', () => {
      const items = [{ value: 1 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([{ value: 1 }]);
    });

    test('should handle an empty array', () => {
      const items: { value: number }[] = [];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([]);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle an array with duplicate values', () => {
      const items = [{ value: 2 }, { value: 1 }, { value: 2 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([{ value: 1 }, { value: 2 }, { value: 2 }]);
    });

    test('should handle an array with negative numbers', () => {
      const items = [{ value: -1 }, { value: -3 }, { value: -2 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([{ value: -3 }, { value: -2 }, { value: -1 }]);
    });

    test('should handle an array with mixed positive and negative numbers', () => {
      const items = [{ value: 3 }, { value: -1 }, { value: 2 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([{ value: -1 }, { value: 2 }, { value: 3 }]);
    });

    test('should handle an array with properties that are all the same', () => {
      const items = [{ value: 1 }, { value: 1 }, { value: 1 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([{ value: 1 }, { value: 1 }, { value: 1 }]);
    });

    test('should handle an array with undefined properties', () => {
      const items = [{ value: 2 }, { value: undefined }, { value: 1 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value ?? 0);
      expect(sortedItems).toEqual([{ value: undefined }, { value: 1 }, { value: 2 }]);
    });

    test('should handle an array with null properties', () => {
      const items = [{ value: 2 }, { value: null }, { value: 1 }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value ?? 0);
      expect(sortedItems).toEqual([{ value: null }, { value: 1 }, { value: 2 }]);
    });

    test('should handle an array with mixed types (numbers and strings)', () => {
      const items = [{ value: '3' }, { value: 1 }, { value: '2' }];
      const sortedItems = ArrayUtils.sortByProperty(items, item => item.value);
      expect(sortedItems).toEqual([{ value: 1 }, { value: '2' }, { value: '3' }]);
    });
  });
});

// End of unit tests for: sortByProperty
