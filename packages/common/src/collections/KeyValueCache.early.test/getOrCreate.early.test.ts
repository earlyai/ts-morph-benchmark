
// Unit tests for: getOrCreate

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.getOrCreate() getOrCreate method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return existing value if key is present', () => {
      // Arrange
      const key = 'existingKey';
      const value = 42;
      cache.set(key, value);

      // Act
      const result = cache.getOrCreate(key, () => 100);

      // Assert
      expect(result).toBe(value);
    });

    test('should create and return new value if key is not present', () => {
      // Arrange
      const key = 'newKey';
      const createFunc = jest.fn(() => 100);

      // Act
      const result = cache.getOrCreate(key, createFunc);

      // Assert
      expect(result).toBe(100);
      expect(createFunc).toHaveBeenCalledTimes(1);
      expect(cache.get(key)).toBe(100);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle null value returned by createFunc', () => {
      // Arrange
      const key = 'nullKey';
      const createFunc = jest.fn(() => null);

      // Act
      const result = cache.getOrCreate(key, createFunc);

      // Assert
      expect(result).toBeNull();
      expect(createFunc).toHaveBeenCalledTimes(1);
      expect(cache.get(key)).toBeNull();
    });

    test('should handle undefined value returned by createFunc', () => {
      // Arrange
      const key = 'undefinedKey';
      const createFunc = jest.fn(() => undefined);

      // Act
      const result = cache.getOrCreate(key, createFunc);

      // Assert
      expect(result).toBeUndefined();
      expect(createFunc).toHaveBeenCalledTimes(1);
      expect(cache.get(key)).toBeUndefined();
    });

    test('should handle empty string as key', () => {
      // Arrange
      const key = '';
      const createFunc = jest.fn(() => 100);

      // Act
      const result = cache.getOrCreate(key, createFunc);

      // Assert
      expect(result).toBe(100);
      expect(createFunc).toHaveBeenCalledTimes(1);
      expect(cache.get(key)).toBe(100);
    });

    test('should handle special characters in key', () => {
      // Arrange
      const key = '!@#$%^&*()';
      const createFunc = jest.fn(() => 100);

      // Act
      const result = cache.getOrCreate(key, createFunc);

      // Assert
      expect(result).toBe(100);
      expect(createFunc).toHaveBeenCalledTimes(1);
      expect(cache.get(key)).toBe(100);
    });

    test('should handle large number of keys', () => {
      // Arrange
      const createFunc = jest.fn((i) => i);

      // Act
      for (let i = 0; i < 10000; i++) {
        cache.getOrCreate(`key${i}`, () => createFunc(i));
      }

      // Assert
      for (let i = 0; i < 10000; i++) {
        expect(cache.get(`key${i}`)).toBe(i);
      }
      expect(createFunc).toHaveBeenCalledTimes(10000);
    });
  });
});

// End of unit tests for: getOrCreate
