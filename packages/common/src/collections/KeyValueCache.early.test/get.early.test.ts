
// Unit tests for: get

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.get() get method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return the value associated with the given key', () => {
      // Arrange
      const key = 'key1';
      const value = 42;
      cache.set(key, value);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBe(value);
    });

    test('should return undefined for a key that does not exist', () => {
      // Arrange
      const key = 'nonExistentKey';

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle null as a key', () => {
      // Arrange
      const key = null as unknown as string;
      const value = 100;
      cache.set(key, value);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBe(value);
    });

    test('should handle undefined as a key', () => {
      // Arrange
      const key = undefined as unknown as string;
      const value = 200;
      cache.set(key, value);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBe(value);
    });

    test('should handle empty string as a key', () => {
      // Arrange
      const key = '';
      const value = 300;
      cache.set(key, value);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBe(value);
    });

    test('should handle special characters in the key', () => {
      // Arrange
      const key = '!@#$%^&*()';
      const value = 400;
      cache.set(key, value);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBe(value);
    });

    test('should handle very large keys', () => {
      // Arrange
      const key = 'a'.repeat(10000);
      const value = 500;
      cache.set(key, value);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBe(value);
    });

    test('should handle very large values', () => {
      // Arrange
      const key = 'largeValueKey';
      const value = Number.MAX_SAFE_INTEGER;
      cache.set(key, value);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBe(value);
    });
  });
});

// End of unit tests for: get
