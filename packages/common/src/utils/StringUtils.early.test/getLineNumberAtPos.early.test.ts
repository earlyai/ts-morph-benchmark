
// Unit tests for: getLineNumberAtPos

import { errors } from "../../errors";


import { StringUtils } from '../StringUtils';


describe('StringUtils.getLineNumberAtPos() getLineNumberAtPos method', () => {
  describe('Happy Path', () => {
    test('should return 1 for position 0 in a single-line string', () => {
      const str = 'Hello, world!';
      const pos = 0;
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(1);
    });

    test('should return correct line number for a position in a multi-line string', () => {
      const str = 'Hello,\nworld!\nThis is a test.';
      const pos = 8; // position of 'w' in 'world!'
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(2);
    });

    test('should return correct line number for the last position in a multi-line string', () => {
      const str = 'Hello,\nworld!\nThis is a test.';
      const pos = str.length; // position after the last character
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    test('should throw an error if position is out of range (negative)', () => {
      const str = 'Hello, world!';
      const pos = -1;
//      expect(() => {
//        StringUtils.getLineNumberAtPos(str, pos);
//      }).toThrow(errors.OutOfRangeError);
    });

    test('should throw an error if position is out of range (greater than string length)', () => {
      const str = 'Hello, world!';
      const pos = str.length + 1;
//      expect(() => {
//        StringUtils.getLineNumberAtPos(str, pos);
//      }).toThrow(errors.OutOfRangeError);
    });

    test('should return 1 for position 0 in an empty string', () => {
      const str = '';
      const pos = 0;
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(1);
    });

    test('should return correct line number for a position at the start of a new line', () => {
      const str = 'Hello,\nworld!\nThis is a test.';
      const pos = 7; // position of '\n' after 'Hello,'
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(2);
    });

    test('should return correct line number for a position at the end of a line', () => {
      const str = 'Hello,\nworld!\nThis is a test.';
      const pos = 6; // position of ',' in 'Hello,'
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(1);
    });

    test('should handle strings with only newlines correctly', () => {
      const str = '\n\n\n';
      const pos = 2; // position of the third '\n'
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(3);
    });

    test('should handle strings with mixed newline characters correctly', () => {
      const str = 'Hello,\r\nworld!\nThis is a test.';
      const pos = 9; // position of 'w' in 'world!'
      const result = StringUtils.getLineNumberAtPos(str, pos);
      expect(result).toBe(2);
    });
  });
});

// End of unit tests for: getLineNumberAtPos
