
// Unit tests for: getEntries

import { KeyValueCache } from '../KeyValueCache';


describe('KeyValueCache.getEntries() getEntries method', () => {
  let cache: KeyValueCache<string, number>;

  beforeEach(() => {
    cache = new KeyValueCache<string, number>();
  });

  describe('Happy Path', () => {
    test('should return an iterator of entries when cache is not empty', () => {
      // Arrange
      cache.set('key1', 1);
      cache.set('key2', 2);

      // Act
      const entries = cache.getEntries();

      // Assert
      const entriesArray = Array.from(entries);
      expect(entriesArray).toEqual([['key1', 1], ['key2', 2]]);
    });

    test('should return an empty iterator when cache is empty', () => {
      // Act
      const entries = cache.getEntries();

      // Assert
      const entriesArray = Array.from(entries);
      expect(entriesArray).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    test('should handle entries with different types of keys and values', () => {
      // Arrange
      const mixedCache = new KeyValueCache<any, any>();
      mixedCache.set('stringKey', 'stringValue');
      mixedCache.set(123, 456);
      mixedCache.set(true, false);

      // Act
      const entries = mixedCache.getEntries();

      // Assert
      const entriesArray = Array.from(entries);
      expect(entriesArray).toEqual([
        ['stringKey', 'stringValue'],
        [123, 456],
        [true, false]
      ]);
    });

    test('should handle entries with complex objects as values', () => {
      // Arrange
      const complexCache = new KeyValueCache<string, { a: number, b: string }>();
      complexCache.set('key1', { a: 1, b: 'one' });
      complexCache.set('key2', { a: 2, b: 'two' });

      // Act
      const entries = complexCache.getEntries();

      // Assert
      const entriesArray = Array.from(entries);
      expect(entriesArray).toEqual([
        ['key1', { a: 1, b: 'one' }],
        ['key2', { a: 2, b: 'two' }]
      ]);
    });

    test('should handle entries with undefined values', () => {
      // Arrange
      cache.set('key1', undefined as any);
      cache.set('key2', 2);

      // Act
      const entries = cache.getEntries();

      // Assert
      const entriesArray = Array.from(entries);
      expect(entriesArray).toEqual([
        ['key1', undefined],
        ['key2', 2]
      ]);
    });

    test('should handle entries with null values', () => {
      // Arrange
      cache.set('key1', null as any);
      cache.set('key2', 2);

      // Act
      const entries = cache.getEntries();

      // Assert
      const entriesArray = Array.from(entries);
      expect(entriesArray).toEqual([
        ['key1', null],
        ['key2', 2]
      ]);
    });
  });
});

// End of unit tests for: getEntries
