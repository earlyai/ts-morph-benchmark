
// Unit tests for: set

import { WeakCache } from '../WeakCache';


describe('WeakCache.set() set method', () => {
  let weakCache: WeakCache<object, any>;

  beforeEach(() => {
    weakCache = new WeakCache<object, any>();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should set a value for a given key', () => {
      const key = {};
      const value = 'testValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should overwrite an existing value for a given key', () => {
      const key = {};
      const initialValue = 'initialValue';
      const newValue = 'newValue';

      weakCache.set(key, initialValue);
      weakCache.set(key, newValue);

      expect(weakCache.get(key)).toBe(newValue);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle setting a value for a key that is an empty object', () => {
      const key = {};
      const value = 'emptyObjectValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should handle setting a value for a key that is a complex object', () => {
      const key = { a: 1, b: { c: 2 } };
      const value = 'complexObjectValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should handle setting a value for a key that is an array', () => {
      const key: object = [];
      const value = 'arrayValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should handle setting a value for a key that is a function', () => {
      const key = () => {};
      const value = 'functionValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

//    test('should handle setting a value for a key that is a symbol', () => {
//      const key = Symbol('testSymbol');
//      const value = 'symbolValue';
//
//      weakCache.set(key, value);
//
//      expect(weakCache.get(key)).toBe(value);
//    });

    test.skip('should handle setting a value for a key that is a DOM element', () => {
      const key = document.createElement('div');
      const value = 'domElementValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should handle setting a value for a key that is a Map', () => {
      const key = new Map();
      const value = 'mapValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should handle setting a value for a key that is a Set', () => {
      const key = new Set();
      const value = 'setValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should handle setting a value for a key that is a WeakMap', () => {
      const key = new WeakMap();
      const value = 'weakMapValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });

    test('should handle setting a value for a key that is a WeakSet', () => {
      const key = new WeakSet();
      const value = 'weakSetValue';

      weakCache.set(key, value);

      expect(weakCache.get(key)).toBe(value);
    });
  });
});

// End of unit tests for: set
