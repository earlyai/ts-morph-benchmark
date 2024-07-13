
// Unit tests for: startsWithNewLine



import { StringUtils } from '../StringUtils';


describe('StringUtils.startsWithNewLine() startsWithNewLine method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true when string starts with a newline character', () => {
      const input = '\nHello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(true);
    });

    test('should return true when string starts with a carriage return followed by a newline character', () => {
      const input = '\r\nHello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(true);
    });

    test('should return false when string does not start with a newline character', () => {
      const input = 'Hello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false when input is undefined', () => {
      const input = undefined;
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return false when input is an empty string', () => {
      const input = '';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return false when string starts with a carriage return but not followed by a newline character', () => {
      const input = '\rHello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return true when string starts with multiple newline characters', () => {
      const input = '\n\nHello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(true);
    });

    test('should return true when string starts with multiple carriage return and newline sequences', () => {
      const input = '\r\n\r\nHello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(true);
    });

    test('should return false when string starts with a space followed by a newline character', () => {
      const input = ' \nHello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(false);
    });

    test('should return false when string starts with a tab followed by a newline character', () => {
      const input = '\t\nHello, World!';
      const result = StringUtils.startsWithNewLine(input);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: startsWithNewLine
