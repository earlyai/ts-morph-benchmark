
// Unit tests for: getSize

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.getSize() getSize method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  describe('Happy Path', () => {
    test('should return 0 when the cache is empty', () => {
      // Arrange & Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(0);
    });

    test('should return the correct size when items are added', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);

      // Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(2);
    });

    test('should return the correct size after items are removed', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.removeByKey('key1');

      // Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(1);
    });

    test('should return the correct size after clearing the cache', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.clear();

      // Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should return the correct size when duplicate keys are added', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key1', 2); // Duplicate key with a different value

      // Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(1);
    });

    test('should return the correct size when keys are replaced', () => {
      // Arrange
      cache.set('key1', 1);
      cache.replaceKey('key1', 'key2');

      // Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(1);
    });

    test('should return the correct size when a non-existent key is removed', () => {
      // Arrange
      cache.set('key1', 1);
      cache.removeByKey('key2'); // Non-existent key

      // Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(1);
    });

    test('should return the correct size when a key is replaced with an existing key', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);
      cache.replaceKey('key1', 'key2'); // Replace key1 with key2

      // Act
      const size = cache.getSize();

      // Assert
      expect(size).toBe(1);
    });
  });
});

// End of unit tests for: getSize
