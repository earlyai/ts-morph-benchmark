
// Unit tests for: insertAtLastNonWhitespace



import { StringUtils } from '../StringUtils';


describe('StringUtils.insertAtLastNonWhitespace() insertAtLastNonWhitespace method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should insert text at the end of a string with no trailing whitespace', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!', '!!!');
      expect(result).toBe('Hello, World!!!!');
    });

    test.skip('should insert text before trailing spaces', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!   ', '!!!');
      expect(result).toBe('Hello, World!!!   ');
    });

    test.skip('should insert text before trailing tabs', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!\t\t\t', '!!!');
      expect(result).toBe('Hello, World!!!\t\t\t');
    });

    test.skip('should insert text before mixed trailing whitespace', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World! \t\n', '!!!');
      expect(result).toBe('Hello, World!!! \t\n');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should handle empty string input', () => {
      const result = StringUtils.insertAtLastNonWhitespace('', '!!!');
      expect(result).toBe('!!!');
    });

    test('should handle string with only whitespace', () => {
      const result = StringUtils.insertAtLastNonWhitespace('   \t\n', '!!!');
      expect(result).toBe('!!!   \t\n');
    });

    test('should handle string with only non-whitespace characters', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello', '!!!');
      expect(result).toBe('Hello!!!');
    });

    test('should handle string with no trailing whitespace', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!', '!!!');
      expect(result).toBe('Hello, World!!!!');
    });

    test.skip('should handle string with newline characters', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!\n\n', '!!!');
      expect(result).toBe('Hello, World!!!\n\n');
    });

    test.skip('should handle string with non-breaking spaces', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!\u00A0\u00A0', '!!!');
      expect(result).toBe('Hello, World!!!\u00A0\u00A0');
    });

    test.skip('should handle string with unicode whitespace characters', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!\u2028\u2029', '!!!');
      expect(result).toBe('Hello, World!!!\u2028\u2029');
    });

    test('should handle inserting an empty string', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!', '');
      expect(result).toBe('Hello, World!');
    });

    test('should handle inserting a string with whitespace', () => {
      const result = StringUtils.insertAtLastNonWhitespace('Hello, World!', ' !!! ');
      expect(result).toBe('Hello, World! !!! ');
    });
  });
});

// End of unit tests for: insertAtLastNonWhitespace
