
// Unit tests for: isNullOrEmpty



import { StringUtils } from '../StringUtils';


describe('StringUtils.isNullOrEmpty() isNullOrEmpty method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for undefined input', () => {
      // This test checks if the method correctly identifies undefined as null or empty.
      expect(StringUtils.isNullOrEmpty(undefined)).toBe(true);
    });

    test('should return true for empty string', () => {
      // This test checks if the method correctly identifies an empty string as null or empty.
      expect(StringUtils.isNullOrEmpty('')).toBe(true);
    });

    test('should return false for non-empty string', () => {
      // This test checks if the method correctly identifies a non-empty string as not null or empty.
      expect(StringUtils.isNullOrEmpty('hello')).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for string with only whitespace', () => {
      // This test checks if the method correctly identifies a string with only whitespace as not null or empty.
      expect(StringUtils.isNullOrEmpty('   ')).toBe(false);
    });

    test('should return false for string with special characters', () => {
      // This test checks if the method correctly identifies a string with special characters as not null or empty.
      expect(StringUtils.isNullOrEmpty('!@#$%^&*()')).toBe(false);
    });

    test('should return false for string with newline characters', () => {
      // This test checks if the method correctly identifies a string with newline characters as not null or empty.
      expect(StringUtils.isNullOrEmpty('\n')).toBe(false);
    });

    test('should return false for string with tab characters', () => {
      // This test checks if the method correctly identifies a string with tab characters as not null or empty.
      expect(StringUtils.isNullOrEmpty('\t')).toBe(false);
    });

    test('should return false for string with mixed whitespace and characters', () => {
      // This test checks if the method correctly identifies a string with mixed whitespace and characters as not null or empty.
      expect(StringUtils.isNullOrEmpty('  hello  ')).toBe(false);
    });

    test('should return false for string with BOM character', () => {
      // This test checks if the method correctly identifies a string with BOM character as not null or empty.
      expect(StringUtils.isNullOrEmpty('\uFEFF')).toBe(false);
    });
  });
});

// End of unit tests for: isNullOrEmpty
