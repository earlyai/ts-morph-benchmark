
// Unit tests for: removeByKey

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.removeByKey() removeByKey method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should remove an existing key from the cache', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);

      // Act
      cache.removeByKey('key1');

      // Assert
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(true);
    });

    test('should not affect other keys when removing a key', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.set('key3', 3);

      // Act
      cache.removeByKey('key2');

      // Assert
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(true);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle removing a key from an empty cache gracefully', () => {
      // Act
      cache.removeByKey('nonexistentKey');

      // Assert
      expect(cache.getSize()).toBe(0);
    });

    test('should handle removing a key that does not exist in the cache', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);

      // Act
      cache.removeByKey('nonexistentKey');

      // Assert
      expect(cache.getSize()).toBe(2);
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(true);
    });

    test('should handle removing a key with undefined value', () => {
      // Arrange
      cache.set('key1', undefined as unknown as number);

      // Act
      cache.removeByKey('key1');

      // Assert
      expect(cache.has('key1')).toBe(false);
    });

    test('should handle removing a key with null value', () => {
      // Arrange
      cache.set('key1', null as unknown as number);

      // Act
      cache.removeByKey('key1');

      // Assert
      expect(cache.has('key1')).toBe(false);
    });

    test('should handle removing a key with complex object as value', () => {
      // Arrange
      const complexValue = { a: 1, b: [2, 3], c: { d: 4 } };
      cache.set('key1', complexValue as unknown as number);

      // Act
      cache.removeByKey('key1');

      // Assert
      expect(cache.has('key1')).toBe(false);
    });
  });
});

// End of unit tests for: removeByKey
