
// Unit tests for: isWhitespace



import { StringUtils } from '../StringUtils';


describe('StringUtils.isWhitespace() isWhitespace method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for a string containing only spaces', () => {
      expect(StringUtils.isWhitespace('   ')).toBe(true);
    });

    test('should return true for a string containing only tab characters', () => {
      expect(StringUtils.isWhitespace('\t\t\t')).toBe(true);
    });

    test('should return true for a string containing only newline characters', () => {
      expect(StringUtils.isWhitespace('\n\n\n')).toBe(true);
    });

    test('should return true for a string containing only carriage return characters', () => {
      expect(StringUtils.isWhitespace('\r\r\r')).toBe(true);
    });

    test('should return true for a string containing a mix of whitespace characters', () => {
      expect(StringUtils.isWhitespace(' \t\n\r')).toBe(true);
    });

    test('should return false for a string containing non-whitespace characters', () => {
      expect(StringUtils.isWhitespace('abc')).toBe(false);
    });

    test('should return false for a string containing a mix of whitespace and non-whitespace characters', () => {
      expect(StringUtils.isWhitespace(' \t\nabc')).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return true for an empty string', () => {
      expect(StringUtils.isWhitespace('')).toBe(true);
    });

    test('should return true for undefined input', () => {
      expect(StringUtils.isWhitespace(undefined)).toBe(true);
    });

    test('should return false for a string containing only non-breaking space characters', () => {
      expect(StringUtils.isWhitespace('\u00A0\u00A0\u00A0')).toBe(true);
    });

    test('should return true for a string containing only line separator characters', () => {
      expect(StringUtils.isWhitespace('\u2028\u2028\u2028')).toBe(true);
    });

    test('should return true for a string containing only paragraph separator characters', () => {
      expect(StringUtils.isWhitespace('\u2029\u2029\u2029')).toBe(true);
    });

    test('should return false for a string containing a mix of whitespace and non-breaking space characters', () => {
      expect(StringUtils.isWhitespace(' \u00A0 ')).toBe(true);
    });

    test('should return false for a string containing a mix of whitespace and non-whitespace characters', () => {
      expect(StringUtils.isWhitespace(' \t\nabc')).toBe(false);
    });

    test('should return false for a string containing only non-whitespace characters', () => {
      expect(StringUtils.isWhitespace('abc')).toBe(false);
    });
  });
});

// End of unit tests for: isWhitespace
