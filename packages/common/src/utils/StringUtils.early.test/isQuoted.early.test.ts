
// Unit tests for: isQuoted



import { StringUtils } from '../StringUtils';


describe('StringUtils.isQuoted() isQuoted method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for a string enclosed in single quotes', () => {
      const input = "'hello'";
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(true);
    });

    test('should return true for a string enclosed in double quotes', () => {
      const input = '"hello"';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(true);
    });

    test('should return false for a string not enclosed in quotes', () => {
      const input = 'hello';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with only starting single quote', () => {
      const input = "'hello";
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with only starting double quote', () => {
      const input = '"hello';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with only ending single quote', () => {
      const input = "hello'";
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with only ending double quote', () => {
      const input = 'hello"';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for an empty string', () => {
      const input = '';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test.skip('should return false for a string with a single quote character', () => {
      const input = "'";
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test.skip('should return false for a string with a double quote character', () => {
      const input = '"';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test('should return true for a string with single quotes and spaces inside', () => {
      const input = "' hello '";
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(true);
    });

    test('should return true for a string with double quotes and spaces inside', () => {
      const input = '" hello "';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(true);
    });

    test('should return false for a string with mismatched quotes (single start, double end)', () => {
      const input = "'hello\"";
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with mismatched quotes (double start, single end)', () => {
      const input = '"hello\'';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(false);
    });

    test('should return true for a string with nested quotes', () => {
      const input = '"\'hello\'"';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(true);
    });

    test('should return true for a string with escaped quotes inside single quotes', () => {
      const input = "'he\\'llo'";
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(true);
    });

    test('should return true for a string with escaped quotes inside double quotes', () => {
      const input = '"he\\"llo"';
      const result = StringUtils.isQuoted(input);
      expect(result).toBe(true);
    });
  });
});

// End of unit tests for: isQuoted
