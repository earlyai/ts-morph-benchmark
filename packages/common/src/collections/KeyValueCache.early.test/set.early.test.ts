
// Unit tests for: set

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.set() set method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  describe('Happy Path', () => {
    test('should add a new key-value pair to the cache', () => {
      // Arrange
      const key = 'key1';
      const value = 1;

      // Act
      cache.set(key, value);

      // Assert
      expect(cache.get(key)).toBe(value);
      expect(cache.getSize()).toBe(1);
    });

    test('should update the value of an existing key', () => {
      // Arrange
      const key = 'key1';
      const initialValue = 1;
      const updatedValue = 2;
      cache.set(key, initialValue);

      // Act
      cache.set(key, updatedValue);

      // Assert
      expect(cache.get(key)).toBe(updatedValue);
      expect(cache.getSize()).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle setting a key with a null value', () => {
      // Arrange
      const key = 'key1';
      const value = null;

      // Act
      cache.set(key, value);

      // Assert
      expect(cache.get(key)).toBe(value);
      expect(cache.getSize()).toBe(1);
    });

    test('should handle setting a key with an undefined value', () => {
      // Arrange
      const key = 'key1';
      const value = undefined;

      // Act
      cache.set(key, value);

      // Assert
      expect(cache.get(key)).toBe(value);
      expect(cache.getSize()).toBe(1);
    });

    test('should handle setting a key with an empty string as the key', () => {
      // Arrange
      const key = '';
      const value = 1;

      // Act
      cache.set(key, value);

      // Assert
      expect(cache.get(key)).toBe(value);
      expect(cache.getSize()).toBe(1);
    });

//    test('should handle setting a key with a complex object as the value', () => {
//      // Arrange
//      const key = 'key1';
//      const value = { a: 1, b: 'test' };
//
//      // Act
//      cache.set(key, value);
//
//      // Assert
//      expect(cache.get(key)).toEqual(value);
//      expect(cache.getSize()).toBe(1);
//    });

    test('should handle setting multiple key-value pairs', () => {
      // Arrange
      const key1 = 'key1';
      const value1 = 1;
      const key2 = 'key2';
      const value2 = 2;

      // Act
      cache.set(key1, value1);
      cache.set(key2, value2);

      // Assert
      expect(cache.get(key1)).toBe(value1);
      expect(cache.get(key2)).toBe(value2);
      expect(cache.getSize()).toBe(2);
    });
  });
});

// End of unit tests for: set
