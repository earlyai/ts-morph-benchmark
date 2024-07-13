
// Unit tests for: getValuesAsArray

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.getValuesAsArray() getValuesAsArray method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  describe('Happy Path', () => {
    test('should return an empty array when the cache is empty', () => {
      // Arrange & Act
      const result = cache.getValuesAsArray();

      // Assert
      expect(result).toEqual([]);
    });

    test('should return an array of values when the cache has multiple items', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.set('key3', 3);

      // Act
      const result = cache.getValuesAsArray();

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });

    test('should return an array of values when the cache has a single item', () => {
      // Arrange
      cache.set('key1', 1);

      // Act
      const result = cache.getValuesAsArray();

      // Assert
      expect(result).toEqual([1]);
    });
  });

  describe('Edge Cases', () => {
    test('should handle non-string keys correctly', () => {
      // Arrange
      const numberCache = new KeyValueCache<number, string>();
      numberCache.set(1, 'one');
      numberCache.set(2, 'two');

      // Act
      const result = numberCache.getValuesAsArray();

      // Assert
      expect(result).toEqual(['one', 'two']);
    });

    test('should handle complex object values correctly', () => {
      // Arrange
      const objectCache = new KeyValueCache<string, { id: number, name: string }>();
      objectCache.set('obj1', { id: 1, name: 'Object 1' });
      objectCache.set('obj2', { id: 2, name: 'Object 2' });

      // Act
      const result = objectCache.getValuesAsArray();

      // Assert
      expect(result).toEqual([{ id: 1, name: 'Object 1' }, { id: 2, name: 'Object 2' }]);
    });

    test('should handle values with undefined correctly', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', undefined as unknown as number);

      // Act
      const result = cache.getValuesAsArray();

      // Assert
      expect(result).toEqual([1, undefined]);
    });

    test('should handle values with null correctly', () => {
      // Arrange
      const nullableCache = new KeyValueCache<string, number | null>();
      nullableCache.set('key1', 1);
      nullableCache.set('key2', null);

      // Act
      const result = nullableCache.getValuesAsArray();

      // Assert
      expect(result).toEqual([1, null]);
    });
  });
});

// End of unit tests for: getValuesAsArray
