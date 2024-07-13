
// Unit tests for: getOrCreate

import { WeakCache } from '../WeakCache';


describe('WeakCache.getOrCreate() getOrCreate method', () => {
  let cache: WeakCache<object, any>;

  beforeEach(() => {
    cache = new WeakCache<object, any>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return the existing item if it exists in the cache', () => {
      const key = {};
      const value = { data: 'existing' };
      cache.set(key, value);

      const result = cache.getOrCreate(key, () => ({ data: 'new' }));

      expect(result).toBe(value);
    });

    test('should create and return a new item if it does not exist in the cache', () => {
      const key = {};
      const newValue = { data: 'new' };

      const result = cache.getOrCreate(key, () => newValue);

      expect(result).toBe(newValue);
      expect(cache.get(key)).toBe(newValue);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle null key gracefully', () => {
      const key = null as any;
      const newValue = { data: 'new' };

      expect(() => cache.getOrCreate(key, () => newValue)).toThrow(TypeError);
    });

    test('should handle undefined key gracefully', () => {
      const key = undefined as any;
      const newValue = { data: 'new' };

      expect(() => cache.getOrCreate(key, () => newValue)).toThrow(TypeError);
    });

    test('should handle non-object key gracefully', () => {
      const key = 42 as any;
      const newValue = { data: 'new' };

      expect(() => cache.getOrCreate(key, () => newValue)).toThrow(TypeError);
    });

    test('should handle createFunc returning null', () => {
      const key = {};
      const createFunc = () => null as any;

      const result = cache.getOrCreate(key, createFunc);

      expect(result).toBeNull();
      expect(cache.get(key)).toBeNull();
    });

    test('should handle createFunc throwing an error', () => {
      const key = {};
      const createFunc = () => {
        throw new Error('Creation failed');
      };

      expect(() => cache.getOrCreate(key, createFunc)).toThrow('Creation failed');
      expect(cache.get(key)).toBeUndefined();
    });
  });
});

// End of unit tests for: getOrCreate
