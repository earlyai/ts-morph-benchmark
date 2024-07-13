
// Unit tests for: has

import { WeakCache } from '../WeakCache';


describe('WeakCache.has() has method', () => {
  let weakCache: WeakCache<object, any>;

  beforeEach(() => {
    weakCache = new WeakCache<object, any>();
  });

  describe('Happy Path', () => {
    test('should return true if the key exists in the cache', () => {
      const key = {};
      const value = 'testValue';
      weakCache.set(key, value);

      expect(weakCache.has(key)).toBe(true);
    });

    test('should return false if the key does not exist in the cache', () => {
      const key = {};

      expect(weakCache.has(key)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should return false for a key that was removed from the cache', () => {
      const key = {};
      const value = 'testValue';
      weakCache.set(key, value);
      weakCache.removeByKey(key);

      expect(weakCache.has(key)).toBe(false);
    });

    test('should return false for a key that is an empty object', () => {
      const key = {};
      // Not setting any value for the key

      expect(weakCache.has(key)).toBe(false);
    });

    test('should return true for a key that is an empty object but was set in the cache', () => {
      const key = {};
      const value = 'testValue';
      weakCache.set(key, value);

      expect(weakCache.has(key)).toBe(true);
    });

    test('should handle multiple keys correctly', () => {
      const key1 = {};
      const key2 = {};
      const value1 = 'value1';
      const value2 = 'value2';

      weakCache.set(key1, value1);
      weakCache.set(key2, value2);

      expect(weakCache.has(key1)).toBe(true);
      expect(weakCache.has(key2)).toBe(true);
    });

    test('should return false for a key that is not an object', () => {
      // @ts-ignore: Ignoring TypeScript error for testing purposes
      expect(weakCache.has(123)).toBe(false);
    });

    test('should return false for a key that is a function', () => {
      const key = () => {};
      // Not setting any value for the key

      expect(weakCache.has(key)).toBe(false);
    });

    test('should return true for a key that is a function and was set in the cache', () => {
      const key = () => {};
      const value = 'testValue';
      weakCache.set(key, value);

      expect(weakCache.has(key)).toBe(true);
    });
  });
});

// End of unit tests for: has
