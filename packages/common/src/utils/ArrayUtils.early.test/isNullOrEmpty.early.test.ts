
// Unit tests for: isNullOrEmpty


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.isNullOrEmpty() isNullOrEmpty method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for undefined input', () => {
      // This test checks if the method correctly identifies undefined as null or empty.
      expect(ArrayUtils.isNullOrEmpty(undefined)).toBe(true);
    });

    test('should return true for an empty array', () => {
      // This test checks if the method correctly identifies an empty array as null or empty.
      expect(ArrayUtils.isNullOrEmpty([])).toBe(true);
    });

    test('should return false for a non-empty array', () => {
      // This test checks if the method correctly identifies a non-empty array as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([1, 2, 3])).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for an array with one element', () => {
      // This test checks if the method correctly identifies an array with one element as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([1])).toBe(false);
    });

    test('should return false for an array with multiple elements', () => {
      // This test checks if the method correctly identifies an array with multiple elements as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([1, 2, 3, 4, 5])).toBe(false);
    });

    test('should return true for an array with empty elements', () => {
      // This test checks if the method correctly identifies an array with empty elements as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([undefined, null, ''])).toBe(false);
    });

    test('should return false for an array with mixed types', () => {
      // This test checks if the method correctly identifies an array with mixed types as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([1, 'string', true, null])).toBe(false);
    });

    test('should return false for an array with nested arrays', () => {
      // This test checks if the method correctly identifies an array with nested arrays as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([[1, 2], [3, 4]])).toBe(false);
    });

    test('should return false for an array with objects', () => {
      // This test checks if the method correctly identifies an array with objects as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([{ key: 'value' }, { key: 'value2' }])).toBe(false);
    });

    test('should return false for an array with functions', () => {
      // This test checks if the method correctly identifies an array with functions as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([() => {}, function() {}])).toBe(false);
    });

    test('should return false for an array with symbols', () => {
      // This test checks if the method correctly identifies an array with symbols as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([Symbol('a'), Symbol('b')])).toBe(false);
    });

    test('should return false for an array with BigInt', () => {
      // This test checks if the method correctly identifies an array with BigInt as not null or empty.
      expect(ArrayUtils.isNullOrEmpty([BigInt(123), BigInt(456)])).toBe(false);
    });
  });
});

// End of unit tests for: isNullOrEmpty
