
// Unit tests for: getKeys

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.getKeys() getKeys method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  describe('Happy Path', () => {
    test('should return an iterator of keys when cache has multiple items', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.set('key3', 3);

      // Act
      const keysIterator = cache.getKeys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual(['key1', 'key2', 'key3']);
    });

    test('should return an empty iterator when cache is empty', () => {
      // Act
      const keysIterator = cache.getKeys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    test('should return an iterator of keys when cache has one item', () => {
      // Arrange
      cache.set('singleKey', 42);

      // Act
      const keysIterator = cache.getKeys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual(['singleKey']);
    });

    test('should return an iterator of keys after some items are removed', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.set('key3', 3);
      cache.removeByKey('key2');

      // Act
      const keysIterator = cache.getKeys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual(['key1', 'key3']);
    });

    test('should return an empty iterator after all items are cleared', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.clear();

      // Act
      const keysIterator = cache.getKeys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual([]);
    });

    test('should handle non-string keys correctly', () => {
      // Arrange
      const numberCache = new KeyValueCache<number, string>();
      numberCache.set(1, 'one');
      numberCache.set(2, 'two');

      // Act
      const keysIterator = numberCache.getKeys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual([1, 2]);
    });

    test('should handle object keys correctly', () => {
      // Arrange
      const objectCache = new KeyValueCache<object, string>();
      const key1 = { id: 1 };
      const key2 = { id: 2 };
      objectCache.set(key1, 'one');
      objectCache.set(key2, 'two');

      // Act
      const keysIterator = objectCache.getKeys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual([key1, key2]);
    });
  });
});

// End of unit tests for: getKeys
