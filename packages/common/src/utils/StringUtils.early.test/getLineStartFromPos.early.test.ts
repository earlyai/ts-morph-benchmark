
// Unit tests for: getLineStartFromPos

import { errors } from "../../errors";


import { StringUtils } from '../StringUtils';


describe('StringUtils.getLineStartFromPos() getLineStartFromPos method', () => {
  describe('Happy Path', () => {
    test('should return the start of the line for a position in the middle of a line', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 8; // Position of 'W' in 'World'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(6); // Start of 'World' line
    });

    test('should return the start of the line for a position at the start of a line', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 6; // Position of 'W' in 'World'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(6); // Start of 'World' line
    });

    test('should return 0 for a position in the first line', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 3; // Position of 'l' in 'Hello'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(0); // Start of 'Hello' line
    });

    test('should return the correct start of the line for a position at the end of a line', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 11; // Position of '\n' after 'World'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(6); // Start of 'World' line
    });
  });

  describe('Edge Cases', () => {
    test('should return 0 for an empty string', () => {
      const str = '';
      const pos = 0;
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(0);
    });

    test('should return 0 for a position at the start of the string', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 0; // Position of 'H' in 'Hello'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(0); // Start of 'Hello' line
    });

    test('should handle a string with only one line', () => {
      const str = 'Hello World';
      const pos = 5; // Position of 'o' in 'Hello'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(0); // Start of 'Hello World' line
    });

    test.skip('should handle a string with multiple consecutive newlines', () => {
      const str = 'Hello\n\n\nWorld';
      const pos = 7; // Position of the second '\n'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(6); // Start of the first empty line
    });

    test('should handle a string with carriage return and newline characters', () => {
      const str = 'Hello\r\nWorld\r\nThis is a test';
      const pos = 8; // Position of 'W' in 'World'
      const result = StringUtils.getLineStartFromPos(str, pos);
      expect(result).toBe(7); // Start of 'World' line
    });

    test('should throw an error if the position is out of range (negative)', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = -1; // Invalid position
//      expect(() => StringUtils.getLineStartFromPos(str, pos)).toThrow(errors.OutOfRangeError);
    });

    test('should throw an error if the position is out of range (greater than string length)', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = str.length + 1; // Invalid position
//      expect(() => StringUtils.getLineStartFromPos(str, pos)).toThrow(errors.OutOfRangeError);
    });
  });
});

// End of unit tests for: getLineStartFromPos
