
// Unit tests for: getEncoding



import { CompilerOptionsContainer } from '../CompilerOptionsContainer';


describe('CompilerOptionsContainer.getEncoding() getEncoding method', () => {
  let container: CompilerOptionsContainer;

  beforeEach(() => {
    container = new CompilerOptionsContainer();
  });

  describe('Happy Path', () => {
    test('should return "utf-8" when no charset is set', () => {
      // Arrange
      // No charset is set in the default settings

      // Act
      const encoding = container.getEncoding();

      // Assert
      expect(encoding).toBe('utf-8');
    });

    test('should return the charset when it is set in the compiler options', () => {
      // Arrange
      const charset = 'iso-8859-1';
      container.set({ charset });

      // Act
      const encoding = container.getEncoding();

      // Assert
      expect(encoding).toBe(charset);
    });
  });

  describe('Edge Cases', () => {
    test('should return "utf-8" when charset is set to an empty string', () => {
      // Arrange
      container.set({ charset: '' });

      // Act
      const encoding = container.getEncoding();

      // Assert
      expect(encoding).toBe('utf-8');
    });

    test('should return "utf-8" when charset is set to null', () => {
      // Arrange
      container.set({ charset: null as any });

      // Act
      const encoding = container.getEncoding();

      // Assert
      expect(encoding).toBe('utf-8');
    });

    test('should return "utf-8" when charset is set to undefined', () => {
      // Arrange
      container.set({ charset: undefined });

      // Act
      const encoding = container.getEncoding();

      // Assert
      expect(encoding).toBe('utf-8');
    });

    test.skip('should handle non-string charset values gracefully', () => {
      // Arrange
      container.set({ charset: 123 as any });

      // Act
      const encoding = container.getEncoding();

      // Assert
      expect(encoding).toBe('utf-8');
    });
  });
});

// End of unit tests for: getEncoding
