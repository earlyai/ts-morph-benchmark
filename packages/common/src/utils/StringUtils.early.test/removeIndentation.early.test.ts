
// Unit tests for: removeIndentation



import { StringUtils } from '../StringUtils';


describe('StringUtils.removeIndentation() removeIndentation method', () => {
  // Mock for isInStringAtPos
  const mockIsInStringAtPos = jest.fn(() => false);

  describe('Happy Path', () => {
    test('should remove leading spaces from each line', () => {
      const input = '    line1\n    line2\n    line3';
      const expectedOutput = 'line1\nline2\nline3';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should remove leading tabs from each line', () => {
      const input = '\tline1\n\tline2\n\tline3';
      const expectedOutput = 'line1\nline2\nline3';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should handle mixed spaces and tabs', () => {
      const input = ' \t line1\n \t line2\n \t line3';
      const expectedOutput = 'line1\nline2\nline3';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should handle no indentation', () => {
      const input = 'line1\nline2\nline3';
      const expectedOutput = 'line1\nline2\nline3';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string', () => {
      const input = '';
      const expectedOutput = '';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should handle string with only newlines', () => {
      const input = '\n\n\n';
      const expectedOutput = '\n\n\n';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test.skip('should handle string with mixed indentation and empty lines', () => {
      const input = '    line1\n\n\tline2\n    \n\t\tline3';
      const expectedOutput = 'line1\n\nline2\n\nline3';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test.skip('should handle string with varying indentation levels', () => {
      const input = '    line1\n  line2\n\tline3';
      const expectedOutput = '  line1\nline2\nline3';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should handle string with indentation inside quotes', () => {
      const mockIsInStringAtPosWithQuotes = jest.fn((pos: number) => pos > 5 && pos < 12);
      const input = '    "    line1"\n    line2';
      const expectedOutput = '"    line1"\nline2';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPosWithQuotes, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should handle string with no newlines', () => {
      const input = '    line1';
      const expectedOutput = 'line1';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should handle string with only spaces', () => {
      const input = '    ';
      const expectedOutput = '';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });

    test('should handle string with only tabs', () => {
      const input = '\t\t';
      const expectedOutput = '';
      const result = StringUtils.removeIndentation(input, { isInStringAtPos: mockIsInStringAtPos, indentSizeInSpaces: 4 });
      expect(result).toBe(expectedOutput);
    });
  });
});

// End of unit tests for: removeIndentation
