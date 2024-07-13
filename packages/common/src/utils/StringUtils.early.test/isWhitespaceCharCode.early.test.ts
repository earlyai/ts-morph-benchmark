
// Unit tests for: isWhitespaceCharCode



import { StringUtils } from '../StringUtils';


describe('StringUtils.isWhitespaceCharCode() isWhitespaceCharCode method', () => {
  describe('Happy Path', () => {
    test('should return true for space character code', () => {
      // Arrange
      const charCode = ' '.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for tab character code', () => {
      // Arrange
      const charCode = '\t'.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for newline character code', () => {
      // Arrange
      const charCode = '\n'.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for non-breaking space character code', () => {
      // Arrange
      const charCode = '\u00A0'.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for line separator character code', () => {
      // Arrange
      const charCode = '\u2028'.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for paragraph separator character code', () => {
      // Arrange
      const charCode = '\u2029'.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should return false for undefined input', () => {
      // Arrange
      const charCode = undefined;

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for non-whitespace character code', () => {
      // Arrange
      const charCode = 'A'.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for negative character code', () => {
      // Arrange
      const charCode = -1;

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for character code beyond valid range', () => {
      // Arrange
      const charCode = 0x110000; // Beyond Unicode range

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for null character code', () => {
      // Arrange
      const charCode = '\0'.charCodeAt(0);

      // Act
      const result = StringUtils.isWhitespaceCharCode(charCode);

      // Assert
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isWhitespaceCharCode
