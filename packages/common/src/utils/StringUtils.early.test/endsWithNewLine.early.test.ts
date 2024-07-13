
// Unit tests for: endsWithNewLine



import { StringUtils } from '../StringUtils';


describe('StringUtils.endsWithNewLine() endsWithNewLine method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true when string ends with a newline character', () => {
      const input = 'Hello World\n';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(true);
    });

    test('should return false when string does not end with a newline character', () => {
      const input = 'Hello World';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return true when string ends with a newline character among other characters', () => {
      const input = 'Hello\nWorld\n';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(true);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for an empty string', () => {
      const input = '';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with only whitespace characters', () => {
      const input = '   ';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return true for a string with only a newline character', () => {
      const input = '\n';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(true);
    });

    test('should return false for a string with a newline character in the middle', () => {
      const input = 'Hello\nWorld';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return false for a string with a carriage return followed by a newline character in the middle', () => {
      const input = 'Hello\r\nWorld';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return true for a string ending with a carriage return followed by a newline character', () => {
      const input = 'Hello World\r\n';
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(true);
    });

    test('should return false for undefined input', () => {
      const input = undefined;
      const result = StringUtils.endsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return false for null input', () => {
      const input = null;
      const result = StringUtils.endsWithNewLine(input as unknown as string);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: endsWithNewLine
