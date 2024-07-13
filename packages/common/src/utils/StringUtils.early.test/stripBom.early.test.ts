
// Unit tests for: stripBom



import { StringUtils } from '../StringUtils';


describe('StringUtils.stripBom() stripBom method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should remove BOM from the beginning of the string', () => {
      const input = '\uFEFFHello, World!';
      const expectedOutput = 'Hello, World!';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });

    test('should return the same string if there is no BOM', () => {
      const input = 'Hello, World!';
      const expectedOutput = 'Hello, World!';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });

    test('should return an empty string if input is an empty string', () => {
      const input = '';
      const expectedOutput = '';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle a string with only BOM', () => {
      const input = '\uFEFF';
      const expectedOutput = '';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });

    test('should handle a string with BOM followed by whitespace', () => {
      const input = '\uFEFF   ';
      const expectedOutput = '   ';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });

    test('should handle a string with BOM followed by newline characters', () => {
      const input = '\uFEFF\nHello\nWorld\n';
      const expectedOutput = '\nHello\nWorld\n';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });

    test('should handle a string with BOM followed by special characters', () => {
      const input = '\uFEFF!@#$%^&*()';
      const expectedOutput = '!@#$%^&*()';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });

    test('should handle a string with BOM followed by non-ASCII characters', () => {
      const input = '\uFEFFこんにちは世界';
      const expectedOutput = 'こんにちは世界';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });

    test('should handle a string with BOM followed by mixed content', () => {
      const input = '\uFEFFHello, 世界! 123';
      const expectedOutput = 'Hello, 世界! 123';
      expect(StringUtils.stripBom(input)).toBe(expectedOutput);
    });
  });
});

// End of unit tests for: stripBom
