
// Unit tests for: removeByKey

import { WeakCache } from '../WeakCache';


describe('WeakCache.removeByKey() removeByKey method', () => {
  let cache: WeakCache<object, any>;

  beforeEach(() => {
    cache = new WeakCache<object, any>();
  });

  describe('Happy Path', () => {
    test('should remove an existing key from the cache', () => {
      const key = {};
      const value = 'testValue';

      cache.set(key, value);
      expect(cache.has(key)).toBe(true);

      cache.removeByKey(key);
      expect(cache.has(key)).toBe(false);
    });

    test('should not throw an error when removing a key that does not exist', () => {
      const key = {};

      expect(() => cache.removeByKey(key)).not.toThrow();
    });

    test('should not affect other keys in the cache', () => {
      const key1 = {};
      const key2 = {};
      const value1 = 'value1';
      const value2 = 'value2';

      cache.set(key1, value1);
      cache.set(key2, value2);

      cache.removeByKey(key1);

      expect(cache.has(key1)).toBe(false);
      expect(cache.has(key2)).toBe(true);
      expect(cache.get(key2)).toBe(value2);
    });
  });

  describe('Edge Cases', () => {
    test('should handle removal of a key that was never added', () => {
      const key = {};

      expect(cache.has(key)).toBe(false);
      cache.removeByKey(key);
      expect(cache.has(key)).toBe(false);
    });

    test('should handle removal of a key that was added and then garbage collected', () => {
      let key = {};
      const value = 'testValue';

      cache.set(key, value);
      expect(cache.has(key)).toBe(true);

      // Simulate garbage collection by setting key to null
      key = null as any;

      // Force garbage collection (this is just a simulation, actual GC behavior is non-deterministic)
      global.gc && global.gc();

      // Since we can't directly test for GC, we just ensure that the cache behaves correctly
      // when we try to remove a key that might have been garbage collected.
      expect(() => cache.removeByKey(key)).not.toThrow();
    });

    test('should handle removal of a key that is an empty object', () => {
      const key = {};
      const value = 'testValue';

      cache.set(key, value);
      expect(cache.has(key)).toBe(true);

      cache.removeByKey(key);
      expect(cache.has(key)).toBe(false);
    });

    test('should handle removal of a key that is a complex object', () => {
      const key = { a: 1, b: { c: 2 } };
      const value = 'testValue';

      cache.set(key, value);
      expect(cache.has(key)).toBe(true);

      cache.removeByKey(key);
      expect(cache.has(key)).toBe(false);
    });
  });
});

// End of unit tests for: removeByKey
