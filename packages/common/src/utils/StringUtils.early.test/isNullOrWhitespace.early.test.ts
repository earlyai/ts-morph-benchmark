
// Unit tests for: isNullOrWhitespace



import { StringUtils } from '../StringUtils';


describe('StringUtils.isNullOrWhitespace() isNullOrWhitespace method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should return true for undefined input', () => {
      // This test checks if the method correctly identifies undefined as null or whitespace.
      expect(StringUtils.isNullOrWhitespace(undefined)).toBe(true);
    });

    test('should return true for null input', () => {
      // This test checks if the method correctly identifies null as null or whitespace.
      expect(StringUtils.isNullOrWhitespace(null as any)).toBe(true);
    });

    test('should return true for empty string', () => {
      // This test checks if the method correctly identifies an empty string as null or whitespace.
      expect(StringUtils.isNullOrWhitespace('')).toBe(true);
    });

    test('should return true for string with only spaces', () => {
      // This test checks if the method correctly identifies a string with only spaces as null or whitespace.
      expect(StringUtils.isNullOrWhitespace('   ')).toBe(true);
    });

    test('should return true for string with only whitespace characters', () => {
      // This test checks if the method correctly identifies a string with various whitespace characters as null or whitespace.
      expect(StringUtils.isNullOrWhitespace('\t\n\r\f\v\u00A0\u2028\u2029')).toBe(true);
    });

    test('should return false for non-whitespace string', () => {
      // This test checks if the method correctly identifies a non-whitespace string as not null or whitespace.
      expect(StringUtils.isNullOrWhitespace('hello')).toBe(false);
    });

    test('should return false for string with leading and trailing whitespace but non-whitespace characters in between', () => {
      // This test checks if the method correctly identifies a string with leading and trailing whitespace but non-whitespace characters in between as not null or whitespace.
      expect(StringUtils.isNullOrWhitespace('  hello  ')).toBe(false);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should return true for string with only a single space', () => {
      // This test checks if the method correctly identifies a string with only a single space as null or whitespace.
      expect(StringUtils.isNullOrWhitespace(' ')).toBe(true);
    });

    test('should return true for string with only a single tab character', () => {
      // This test checks if the method correctly identifies a string with only a single tab character as null or whitespace.
      expect(StringUtils.isNullOrWhitespace('\t')).toBe(true);
    });

    test('should return true for string with only a single newline character', () => {
      // This test checks if the method correctly identifies a string with only a single newline character as null or whitespace.
      expect(StringUtils.isNullOrWhitespace('\n')).toBe(true);
    });

    test('should return true for string with only a single non-breaking space character', () => {
      // This test checks if the method correctly identifies a string with only a single non-breaking space character as null or whitespace.
      expect(StringUtils.isNullOrWhitespace('\u00A0')).toBe(true);
    });

    test('should return false for string with mixed whitespace and non-whitespace characters', () => {
      // This test checks if the method correctly identifies a string with mixed whitespace and non-whitespace characters as not null or whitespace.
      expect(StringUtils.isNullOrWhitespace(' \t\nhello\r\f\v')).toBe(false);
    });

    test('should return false for string with only non-whitespace characters', () => {
      // This test checks if the method correctly identifies a string with only non-whitespace characters as not null or whitespace.
      expect(StringUtils.isNullOrWhitespace('hello')).toBe(false);
    });

    test('should return false for string with non-whitespace characters surrounded by whitespace', () => {
      // This test checks if the method correctly identifies a string with non-whitespace characters surrounded by whitespace as not null or whitespace.
      expect(StringUtils.isNullOrWhitespace(' \t\nhello\r\f\v ')).toBe(false);
    });
  });
});

// End of unit tests for: isNullOrWhitespace
