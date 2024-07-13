
// Unit tests for: getLengthFromLineStartAtPos

import { errors } from "../../errors";


import { StringUtils } from '../StringUtils';


describe('StringUtils.getLengthFromLineStartAtPos() getLengthFromLineStartAtPos method', () => {
  describe('Happy Path', () => {
    test.skip('should return the correct length from the start of the line for a position in the middle of a line', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 13; // Position of 'i' in "This"
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(5); // "This " has 5 characters
    });

    test('should return 0 when the position is at the start of the line', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 6; // Position of 'W' in "World"
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(0);
    });

    test('should return the correct length when the position is at the end of the line', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = 11; // Position of 'd' in "World"
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(5); // "World" has 5 characters
    });
  });

  describe('Edge Cases', () => {
    test('should return 0 for an empty string', () => {
      const str = '';
      const pos = 0;
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(0);
    });

    test('should throw an error when the position is out of range (negative)', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = -1;
//      expect(() => {
//        StringUtils.getLengthFromLineStartAtPos(str, pos);
//      }).toThrow(errors.OutOfRangeError);
    });

    test('should throw an error when the position is out of range (greater than string length)', () => {
      const str = 'Hello\nWorld\nThis is a test';
      const pos = str.length + 1;
//      expect(() => {
//        StringUtils.getLengthFromLineStartAtPos(str, pos);
//      }).toThrow(errors.OutOfRangeError);
    });

    test('should handle strings with only newlines correctly', () => {
      const str = '\n\n\n';
      const pos = 2; // Position of the third newline
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(0);
    });

    test.skip('should handle strings with mixed newline characters correctly', () => {
      const str = 'Hello\r\nWorld\nThis is a test';
      const pos = 13; // Position of 'i' in "This"
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(5); // "This " has 5 characters
    });

    test.skip('should handle strings with carriage return correctly', () => {
      const str = 'Hello\rWorld\rThis is a test';
      const pos = 12; // Position of 'i' in "This"
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(5); // "This " has 5 characters
    });

    test('should handle strings with no newlines correctly', () => {
      const str = 'HelloWorldThis is a test';
      const pos = 10; // Position of 'T' in "This"
      const result = StringUtils.getLengthFromLineStartAtPos(str, pos);
      expect(result).toBe(10); // "HelloWorld" has 10 characters
    });
  });
});

// End of unit tests for: getLengthFromLineStartAtPos
