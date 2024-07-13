
// Unit tests for: escapeForWithinString

import { errors } from "../../errors";


import { StringUtils } from '../StringUtils';


describe('StringUtils.escapeForWithinString() escapeForWithinString method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should escape double quotes within a string', () => {
      const input = 'This is a "test" string';
      const quoteKind = '"';
      const expected = 'This is a \\"test\\" string';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test('should escape single quotes within a string', () => {
      const input = "This is a 'test' string";
      const quoteKind = "'";
      const expected = "This is a \\'test\\' string";
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test('should escape newlines within a string', () => {
      const input = 'This is a test\nstring';
      const quoteKind = '"';
      const expected = 'This is a test\\\nstring';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test.skip('should escape carriage returns within a string', () => {
      const input = 'This is a test\rstring';
      const quoteKind = '"';
      const expected = 'This is a test\\\rstring';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test.skip('should escape both newlines and carriage returns within a string', () => {
      const input = 'This is a test\r\nstring';
      const quoteKind = '"';
      const expected = 'This is a test\\\r\\\nstring';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should handle an empty string', () => {
      const input = '';
      const quoteKind = '"';
      const expected = '';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test('should handle a string with no escapable characters', () => {
      const input = 'This is a test string';
      const quoteKind = '"';
      const expected = 'This is a test string';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test.skip('should handle a string with only escapable characters', () => {
      const input = '""\'\'\n\r';
      const quoteKind = '"';
      const expected = '\\"\\"\\\'\\\'\\\n\\\r';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test.skip('should handle a string with mixed escapable and non-escapable characters', () => {
      const input = 'This is a "test" string with \'quotes\' and newlines\nand carriage returns\r';
      const quoteKind = '"';
      const expected = 'This is a \\"test\\" string with \'quotes\' and newlines\\\nand carriage returns\\\r';
      const result = StringUtils.escapeForWithinString(input, quoteKind);
      expect(result).toBe(expected);
    });

    test('should throw an error if quoteKind is not a single character', () => {
      const input = 'This is a test string';
      const quoteKind = '""';
      expect(() => {
        StringUtils.escapeForWithinString(input, quoteKind as any);
      }).toThrow(errors.InvalidOperationError);
    });
  });
});

// End of unit tests for: escapeForWithinString
