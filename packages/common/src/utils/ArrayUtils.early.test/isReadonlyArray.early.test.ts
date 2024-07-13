
// Unit tests for: isReadonlyArray


import { ArrayUtils } from '../ArrayUtils';

describe('ArrayUtils.isReadonlyArray() isReadonlyArray method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should return true for a regular array', () => {
      // Arrange
      const input = [1, 2, 3];

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for an empty array', () => {
      // Arrange
      const input: number[] = [];

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for a readonly array', () => {
      // Arrange
      const input: ReadonlyArray<number> = [1, 2, 3];

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(true);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should return false for a string', () => {
      // Arrange
      const input = 'not an array';

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for a number', () => {
      // Arrange
      const input = 123;

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for an object', () => {
      // Arrange
      const input = { key: 'value' };

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for null', () => {
      // Arrange
      const input = null;

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for undefined', () => {
      // Arrange
      const input = undefined;

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for a function', () => {
      // Arrange
      const input = () => {};

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for a Set', () => {
      // Arrange
      const input = new Set([1, 2, 3]);

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for a Map', () => {
      // Arrange
      const input = new Map();

      // Act
      const result = ArrayUtils.isReadonlyArray(input);

      // Assert
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isReadonlyArray
