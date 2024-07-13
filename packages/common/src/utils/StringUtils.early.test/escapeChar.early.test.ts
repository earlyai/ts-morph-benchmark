
// Unit tests for: escapeChar

import { errors } from "../../errors";


import { StringUtils } from '../StringUtils';


describe('StringUtils.escapeChar() escapeChar method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should escape all occurrences of the specified character', () => {
      const input = 'hello world';
      const charToEscape = 'o';
      const expectedOutput = 'hell\\o w\\orld';
      expect(StringUtils.escapeChar(input, charToEscape)).toBe(expectedOutput);
    });

    test('should escape all occurrences of the specified character at the beginning and end', () => {
      const input = 'ohello worldo';
      const charToEscape = 'o';
      const expectedOutput = '\\ohell\\o w\\orld\\o';
      expect(StringUtils.escapeChar(input, charToEscape)).toBe(expectedOutput);
    });

    test('should return the same string if the character to escape is not present', () => {
      const input = 'hello world';
      const charToEscape = 'x';
      const expectedOutput = 'hello world';
      expect(StringUtils.escapeChar(input, charToEscape)).toBe(expectedOutput);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should throw an error if the specified character is more than one character long', () => {
      const input = 'hello world';
      const charToEscape = 'oo';
      expect(() => StringUtils.escapeChar(input, charToEscape)).toThrow(errors.InvalidOperationError);
    });

    test('should handle an empty string input gracefully', () => {
      const input = '';
      const charToEscape = 'o';
      const expectedOutput = '';
      expect(StringUtils.escapeChar(input, charToEscape)).toBe(expectedOutput);
    });

    test('should handle a string with only the character to escape', () => {
      const input = 'oooo';
      const charToEscape = 'o';
      const expectedOutput = '\\o\\o\\o\\o';
      expect(StringUtils.escapeChar(input, charToEscape)).toBe(expectedOutput);
    });

    test('should handle a string with special characters', () => {
      const input = 'hello\nworld';
      const charToEscape = '\n';
      const expectedOutput = 'hello\\\nworld';
      expect(StringUtils.escapeChar(input, charToEscape)).toBe(expectedOutput);
    });

    test('should handle a string with unicode characters', () => {
      const input = 'hello\u2028world';
      const charToEscape = '\u2028';
      const expectedOutput = 'hello\\\u2028world';
      expect(StringUtils.escapeChar(input, charToEscape)).toBe(expectedOutput);
    });
  });
});

// End of unit tests for: escapeChar
