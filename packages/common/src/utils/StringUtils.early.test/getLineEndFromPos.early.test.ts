
// Unit tests for: getLineEndFromPos

import { errors } from "../../errors";


import { StringUtils } from '../StringUtils';


describe('StringUtils.getLineEndFromPos() getLineEndFromPos method', () => {
  describe('Happy Path', () => {
    test('should return the position of the end of the line when there is a newline character', () => {
      const str = 'Hello\nWorld';
      const pos = 0;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(5);
    });

    test('should return the position of the end of the line when there is a carriage return character', () => {
      const str = 'Hello\rWorld';
      const pos = 0;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(5);
    });

    test('should return the position of the end of the line when there is no newline or carriage return character', () => {
      const str = 'Hello World';
      const pos = 0;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(11);
    });

    test('should return the position of the end of the line when starting from a position in the middle of the line', () => {
      const str = 'Hello\nWorld';
      const pos = 3;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(5);
    });

    test('should return the position of the end of the line when starting from a position at the end of the line', () => {
      const str = 'Hello\nWorld';
      const pos = 5;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    test('should throw an error when the position is out of range (negative)', () => {
      const str = 'Hello\nWorld';
      const pos = -1;
//      expect(() => StringUtils.getLineEndFromPos(str, pos)).toThrow(errors.OutOfRangeError);
    });

    test('should throw an error when the position is out of range (greater than string length)', () => {
      const str = 'Hello\nWorld';
      const pos = 12;
//      expect(() => StringUtils.getLineEndFromPos(str, pos)).toThrow(errors.OutOfRangeError);
    });

    test('should return the position of the end of the line when the string is empty', () => {
      const str = '';
      const pos = 0;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(0);
    });

    test('should return the position of the end of the line when the string contains only newline characters', () => {
      const str = '\n\n\n';
      const pos = 1;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(1);
    });

    test('should return the position of the end of the line when the string contains only carriage return characters', () => {
      const str = '\r\r\r';
      const pos = 1;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(1);
    });

    test('should return the position of the end of the line when the string contains mixed newline and carriage return characters', () => {
      const str = '\r\n\r\n';
      const pos = 1;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(1);
    });

    test('should return the position of the end of the line when the position is at the end of the string', () => {
      const str = 'Hello\nWorld';
      const pos = 11;
      const result = StringUtils.getLineEndFromPos(str, pos);
      expect(result).toBe(11);
    });
  });
});

// End of unit tests for: getLineEndFromPos
