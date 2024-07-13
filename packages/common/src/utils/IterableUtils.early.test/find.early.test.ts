
// Unit tests for: find

import { IterableUtils } from '../IterableUtils';


describe('IterableUtils.find() find method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return the first item that matches the condition', () => {
      const items = [1, 2, 3, 4, 5][Symbol.iterator]();
      const condition = (item: number) => item > 3;
      const result = IterableUtils.find(items, condition);
      expect(result).toBe(4);
    });

    test('should return undefined if no items match the condition', () => {
      const items = [1, 2, 3, 4, 5][Symbol.iterator]();
      const condition = (item: number) => item > 5;
      const result = IterableUtils.find(items, condition);
      expect(result).toBeUndefined();
    });

    test('should work with different types of items', () => {
      const items = ['apple', 'banana', 'cherry'][Symbol.iterator]();
      const condition = (item: string) => item.startsWith('b');
      const result = IterableUtils.find(items, condition);
      expect(result).toBe('banana');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return undefined for an empty iterator', () => {
      const items: IterableIterator<number> = [][Symbol.iterator]();
      const condition = (item: number) => item > 0;
      const result = IterableUtils.find(items, condition);
      expect(result).toBeUndefined();
    });

    test('should handle condition that always returns false', () => {
      const items = [1, 2, 3][Symbol.iterator]();
      const condition = () => false;
      const result = IterableUtils.find(items, condition);
      expect(result).toBeUndefined();
    });

    test('should handle condition that always returns true', () => {
      const items = [1, 2, 3][Symbol.iterator]();
      const condition = () => true;
      const result = IterableUtils.find(items, condition);
      expect(result).toBe(1);
    });

    test('should handle condition that matches the last item', () => {
      const items = [1, 2, 3, 4, 5][Symbol.iterator]();
      const condition = (item: number) => item === 5;
      const result = IterableUtils.find(items, condition);
      expect(result).toBe(5);
    });

    test('should handle condition that matches the first item', () => {
      const items = [1, 2, 3, 4, 5][Symbol.iterator]();
      const condition = (item: number) => item === 1;
      const result = IterableUtils.find(items, condition);
      expect(result).toBe(1);
    });

    test('should handle non-primitive types', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }][Symbol.iterator]();
      const condition = (item: { id: number }) => item.id === 2;
      const result = IterableUtils.find(items, condition);
      expect(result).toEqual({ id: 2 });
    });
  });
});

// End of unit tests for: find
