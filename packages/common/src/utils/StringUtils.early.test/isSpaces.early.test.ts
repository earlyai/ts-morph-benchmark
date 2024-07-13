
// Unit tests for: isSpaces



import { StringUtils } from '../StringUtils';


describe('StringUtils.isSpaces() isSpaces method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should return true for a string with only spaces', () => {
      const input = '   ';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(true);
    });

    test('should return false for a string with non-space characters', () => {
      const input = ' a ';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with tabs', () => {
      const input = '\t\t\t';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with newlines', () => {
      const input = '\n\n\n';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should return false for an empty string', () => {
      const input = '';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });

    test('should return false for null input', () => {
      const input = null as unknown as string;
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });

    test('should return false for undefined input', () => {
      const input = undefined as unknown as string;
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with mixed spaces and other whitespace characters', () => {
      const input = ' \t \n ';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with non-breaking spaces', () => {
      const input = '\u00A0\u00A0\u00A0';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with Unicode whitespace characters', () => {
      const input = '\u2028\u2029';
      const result = StringUtils.isSpaces(input);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isSpaces
