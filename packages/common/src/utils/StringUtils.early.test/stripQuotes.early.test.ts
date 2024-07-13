
// Unit tests for: stripQuotes



import { StringUtils } from '../StringUtils';


describe('StringUtils.stripQuotes() stripQuotes method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should remove single quotes from a string', () => {
      const input = "'hello'";
      const expectedOutput = "hello";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should remove double quotes from a string', () => {
      const input = '"world"';
      const expectedOutput = "world";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should return the same string if it is not quoted', () => {
      const input = "noQuotes";
      const expectedOutput = "noQuotes";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should return an empty string if input is empty', () => {
      const input = "";
      const expectedOutput = "";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should return the same string if it is a single quote', () => {
      const input = "'";
      const expectedOutput = "'";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should return the same string if it is a double quote', () => {
      const input = '"';
      const expectedOutput = '"';
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should return the same string if it starts with a single quote but does not end with one', () => {
      const input = "'notClosed";
      const expectedOutput = "'notClosed";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should return the same string if it starts with a double quote but does not end with one', () => {
      const input = '"notClosed';
      const expectedOutput = '"notClosed';
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should return the same string if it ends with a single quote but does not start with one', () => {
      const input = "notOpened'";
      const expectedOutput = "notOpened'";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should return the same string if it ends with a double quote but does not start with one', () => {
      const input = 'notOpened"';
      const expectedOutput = 'notOpened"';
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should handle strings with only whitespace inside quotes', () => {
      const input = "'   '";
      const expectedOutput = "   ";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should handle strings with mixed quotes inside', () => {
      const input = "'\"mixed\"'";
      const expectedOutput = "\"mixed\"";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });

    test('should handle strings with escaped quotes inside', () => {
      const input = "'\\'escaped\\''";
      const expectedOutput = "\\'escaped\\'";
      expect(StringUtils.stripQuotes(input)).toBe(expectedOutput);
    });
  });
});

// End of unit tests for: stripQuotes
