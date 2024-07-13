
// Unit tests for: clear

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.clear() clear method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should clear all items from the cache', () => {
      // Arrange: Add some items to the cache
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.set('key3', 3);

      // Act: Clear the cache
      cache.clear();

      // Assert: Ensure the cache is empty
      expect(cache.getSize()).toBe(0);
      expect(Array.from(cache.getValues())).toEqual([]);
      expect(Array.from(cache.getKeys())).toEqual([]);
    });

    test('should not throw an error when clearing an already empty cache', () => {
      // Act & Assert: Clear the cache and ensure no error is thrown
      expect(() => cache.clear()).not.toThrow();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle clearing a cache with a single item', () => {
      // Arrange: Add a single item to the cache
      cache.set('key1', 1);

      // Act: Clear the cache
      cache.clear();

      // Assert: Ensure the cache is empty
      expect(cache.getSize()).toBe(0);
      expect(Array.from(cache.getValues())).toEqual([]);
      expect(Array.from(cache.getKeys())).toEqual([]);
    });

    test('should handle clearing a cache with multiple items of different types', () => {
      // Arrange: Add multiple items of different types to the cache
      const mixedCache = new KeyValueCache<any, any>();
      mixedCache.set('key1', 1);
      mixedCache.set(2, 'value2');
      mixedCache.set(true, { obj: 'value3' });

      // Act: Clear the cache
      mixedCache.clear();

      // Assert: Ensure the cache is empty
      expect(mixedCache.getSize()).toBe(0);
      expect(Array.from(mixedCache.getValues())).toEqual([]);
      expect(Array.from(mixedCache.getKeys())).toEqual([]);
    });

    test('should handle clearing a cache after multiple operations', () => {
      // Arrange: Perform multiple operations on the cache
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.removeByKey('key1');
      cache.set('key3', 3);

      // Act: Clear the cache
      cache.clear();

      // Assert: Ensure the cache is empty
      expect(cache.getSize()).toBe(0);
      expect(Array.from(cache.getValues())).toEqual([]);
      expect(Array.from(cache.getKeys())).toEqual([]);
    });
  });
});

// End of unit tests for: clear
