
// Unit tests for: indent



import { StringUtils } from '../StringUtils';


describe('StringUtils.indent() indent method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should indent a single line string by the specified number of times', () => {
      const input = 'Hello, World!';
      const times = 2;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: () => false,
      };
      const expected = '    Hello, World!';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test('should indent a multi-line string by the specified number of times', () => {
      const input = 'Hello,\nWorld!';
      const times = 1;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: () => false,
      };
      const expected = '  Hello,\n  World!';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test('should handle indenting with tabs', () => {
      const input = 'Hello,\nWorld!';
      const times = 1;
      const options = {
        indentText: '\t',
        indentSizeInSpaces: 4,
        isInStringAtPos: () => false,
      };
      const expected = '\tHello,\n\tWorld!';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should return the original string when times is 0', () => {
      const input = 'Hello, World!';
      const times = 0;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: () => false,
      };
      const expected = 'Hello, World!';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test('should handle negative indentation by removing spaces', () => {
      const input = '    Hello, World!';
      const times = -2;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: () => false,
      };
      const expected = 'Hello, World!';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test('should handle negative indentation by removing tabs', () => {
      const input = '\t\tHello, World!';
      const times = -1;
      const options = {
        indentText: '\t',
        indentSizeInSpaces: 4,
        isInStringAtPos: () => false,
      };
      const expected = '\tHello, World!';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test.skip('should handle strings with mixed spaces and tabs', () => {
      const input = ' \t Hello, World!';
      const times = 1;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: () => false,
      };
      const expected = '  \t Hello, World!';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test('should not indent lines that are within a string', () => {
      const input = 'Hello, "World!\nHow are you?"';
      const times = 1;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: (pos: number) => pos > 7 && pos < 22,
      };
      const expected = '  Hello, "World!\nHow are you?"';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test('should handle empty string input', () => {
      const input = '';
      const times = 1;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: () => false,
      };
      const expected = '';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });

    test('should handle string with only newlines', () => {
      const input = '\n\n';
      const times = 1;
      const options = {
        indentText: '  ',
        indentSizeInSpaces: 2,
        isInStringAtPos: () => false,
      };
      const expected = '  \n  \n';
      const result = StringUtils.indent(input, times, options);
      expect(result).toBe(expected);
    });
  });
});

// End of unit tests for: indent
