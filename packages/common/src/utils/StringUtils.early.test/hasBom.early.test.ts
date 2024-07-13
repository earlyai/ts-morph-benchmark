
// Unit tests for: hasBom



import { StringUtils } from '../StringUtils';


describe('StringUtils.hasBom() hasBom method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true when the string starts with a BOM character', () => {
      const text = '\uFEFFHello, World!';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(true);
    });

    test('should return false when the string does not start with a BOM character', () => {
      const text = 'Hello, World!';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for an empty string', () => {
      const text = '';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(false);
    });

    test('should return false for a string with only whitespace characters', () => {
      const text = '   \n\t';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(false);
    });

    test('should return false for a string with a BOM character not at the start', () => {
      const text = 'Hello, \uFEFFWorld!';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(false);
    });

    test('should return false for a string with multiple BOM characters not at the start', () => {
      const text = 'Hello, \uFEFFWorld!\uFEFF';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(false);
    });

    test('should return true for a string with only a BOM character', () => {
      const text = '\uFEFF';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(true);
    });

    test('should return false for a string with a similar character to BOM but not BOM', () => {
      const text = '\uFFFEHello, World!';
      const result = StringUtils.hasBom(text);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: hasBom
