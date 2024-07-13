
// Unit tests for: getValues

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.getValues() getValues method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  describe('Happy Path', () => {
    test('should return an iterator of values when cache has multiple items', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.set('key3', 3);

      // Act
      const valuesIterator = cache.getValues();
      const valuesArray = Array.from(valuesIterator);

      // Assert
      expect(valuesArray).toEqual([1, 2, 3]);
    });

    test('should return an empty iterator when cache is empty', () => {
      // Act
      const valuesIterator = cache.getValues();
      const valuesArray = Array.from(valuesIterator);

      // Assert
      expect(valuesArray).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    test('should return an iterator of values when cache has a single item', () => {
      // Arrange
      cache.set('key1', 1);

      // Act
      const valuesIterator = cache.getValues();
      const valuesArray = Array.from(valuesIterator);

      // Assert
      expect(valuesArray).toEqual([1]);
    });

    test('should return an iterator of values when cache has items with different types of keys', () => {
      // Arrange
      const mixedCache = new KeyValueCache<any, number>();
      mixedCache.set('key1', 1);
      mixedCache.set(2, 2);
      mixedCache.set(true, 3);

      // Act
      const valuesIterator = mixedCache.getValues();
      const valuesArray = Array.from(valuesIterator);

      // Assert
      expect(valuesArray).toEqual([1, 2, 3]);
    });

    test.skip('should handle concurrent modifications gracefully', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);

      // Act
      const valuesIterator = cache.getValues();
      cache.set('key3', 3); // Modify cache after getting the iterator
      const valuesArray = Array.from(valuesIterator);

      // Assert
      expect(valuesArray).toEqual([1, 2]); // Iterator should reflect the state at the time of its creation
    });
  });
});

// End of unit tests for: getValues
