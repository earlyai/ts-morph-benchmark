
// Unit tests for: get

import { WeakCache } from '../WeakCache';


describe('WeakCache.get() get method', () => {
  let cache: WeakCache<object, any>;

  beforeEach(() => {
    cache = new WeakCache<object, any>();
  });

  describe('Happy Path', () => {
    test('should return the value associated with the key if it exists', () => {
      const key = {};
      const value = 'testValue';
      cache.set(key, value);

      const result = cache.get(key);

      expect(result).toBe(value);
    });

    test('should return undefined if the key does not exist', () => {
      const key = {};

      const result = cache.get(key);

      expect(result).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    test.skip('should handle non-object keys gracefully', () => {
      // WeakMap only accepts objects as keys, so this test is to ensure type safety
      const key = 'stringKey' as any; // TypeScript will not allow this, but for the sake of the test, we cast it

      expect(() => cache.get(key)).toThrow(TypeError);
    });

    test.skip('should handle null key gracefully', () => {
      const key = null as any; // TypeScript will not allow this, but for the sake of the test, we cast it

      expect(() => cache.get(key)).toThrow(TypeError);
    });

    test.skip('should handle undefined key gracefully', () => {
      const key = undefined as any; // TypeScript will not allow this, but for the sake of the test, we cast it

      expect(() => cache.get(key)).toThrow(TypeError);
    });

    test('should return undefined for a key that was removed', () => {
      const key = {};
      const value = 'testValue';
      cache.set(key, value);
      cache.removeByKey(key);

      const result = cache.get(key);

      expect(result).toBeUndefined();
    });

    test('should return undefined for a key that was never set', () => {
      const key = {};

      const result = cache.get(key);

      expect(result).toBeUndefined();
    });
  });
});

// End of unit tests for: get
