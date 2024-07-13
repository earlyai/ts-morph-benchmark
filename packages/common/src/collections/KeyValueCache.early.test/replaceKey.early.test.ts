
// Unit tests for: replaceKey

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.replaceKey() replaceKey method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should replace an existing key with a new key', () => {
      // Arrange
      cache.set('oldKey', 42);

      // Act
      cache.replaceKey('oldKey', 'newKey');

      // Assert
      expect(cache.has('oldKey')).toBe(false);
      expect(cache.has('newKey')).toBe(true);
      expect(cache.get('newKey')).toBe(42);
    });

    test('should maintain the value associated with the key after replacement', () => {
      // Arrange
      cache.set('oldKey', 100);

      // Act
      cache.replaceKey('oldKey', 'newKey');

      // Assert
      expect(cache.get('newKey')).toBe(100);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should throw an error if the key to be replaced does not exist', () => {
      // Arrange
      const nonExistentKey = 'nonExistentKey';

      // Act & Assert
      expect(() => cache.replaceKey(nonExistentKey, 'newKey')).toThrowError('Key not found.');
    });

    test('should replace the key even if the new key already exists, overwriting the existing value', () => {
      // Arrange
      cache.set('oldKey', 42);
      cache.set('newKey', 100);

      // Act
      cache.replaceKey('oldKey', 'newKey');

      // Assert
      expect(cache.has('oldKey')).toBe(false);
      expect(cache.has('newKey')).toBe(true);
      expect(cache.get('newKey')).toBe(42);
    });

    test('should handle replacing a key with itself gracefully', () => {
      // Arrange
      cache.set('key', 42);

      // Act
      cache.replaceKey('key', 'key');

      // Assert
      expect(cache.has('key')).toBe(true);
      expect(cache.get('key')).toBe(42);
    });

    test('should handle replacing a key in an empty cache gracefully', () => {
      // Act & Assert
      expect(() => cache.replaceKey('nonExistentKey', 'newKey')).toThrowError('Key not found.');
    });
  });
});

// End of unit tests for: replaceKey
