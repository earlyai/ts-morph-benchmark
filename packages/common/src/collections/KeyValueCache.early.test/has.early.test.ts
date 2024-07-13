
// Unit tests for: has

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.has() has method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true if the key exists in the cache', () => {
      // Arrange
      const key = 'existingKey';
      const value = 42;
      cache.set(key, value);

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false if the key does not exist in the cache', () => {
      // Arrange
      const key = 'nonExistingKey';

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for a key that was removed from the cache', () => {
      // Arrange
      const key = 'keyToRemove';
      const value = 100;
      cache.set(key, value);
      cache.removeByKey(key);

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for a key that was replaced with a new key', () => {
      // Arrange
      const oldKey = 'oldKey';
      const newKey = 'newKey';
      const value = 200;
      cache.set(oldKey, value);
      cache.replaceKey(oldKey, newKey);

      // Act
      const result = cache.has(newKey);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for a key that was replaced with a new key', () => {
      // Arrange
      const oldKey = 'oldKey';
      const newKey = 'newKey';
      const value = 200;
      cache.set(oldKey, value);
      cache.replaceKey(oldKey, newKey);

      // Act
      const result = cache.has(oldKey);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for a key after the cache is cleared', () => {
      // Arrange
      const key = 'keyToClear';
      const value = 300;
      cache.set(key, value);
      cache.clear();

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(false);
    });

    test('should handle checking for a key in an empty cache', () => {
      // Arrange
      const key = 'anyKey';

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: has
