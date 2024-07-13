
// Unit tests for: getTextWithByteOrderMark


import { StringUtils } from "../../utils";




import { FileUtils } from '../FileUtils';


// Mocking StringUtils.hasBom method
jest.mock("../../utils", () => ({
  StringUtils: {
    hasBom: jest.fn(),
  },
}));

describe('FileUtils.getTextWithByteOrderMark() getTextWithByteOrderMark method', () => {
  describe('Happy Path', () => {
    it('should return the text with BOM if it does not already have one', () => {
      // Arrange
      const text = 'Hello, World!';
      (StringUtils.hasBom as jest.Mock).mockReturnValue(false);

      // Act
      const result = FileUtils.getTextWithByteOrderMark(text);

      // Assert
      expect(result).toBe('\uFEFF' + text);
    });

    it('should return the text as is if it already has a BOM', () => {
      // Arrange
      const text = '\uFEFFHello, World!';
      (StringUtils.hasBom as jest.Mock).mockReturnValue(true);

      // Act
      const result = FileUtils.getTextWithByteOrderMark(text);

      // Assert
      expect(result).toBe(text);
    });
  });

  describe('Edge Cases', () => {
    it('should return BOM only if the text is empty and does not have a BOM', () => {
      // Arrange
      const text = '';
      (StringUtils.hasBom as jest.Mock).mockReturnValue(false);

      // Act
      const result = FileUtils.getTextWithByteOrderMark(text);

      // Assert
      expect(result).toBe('\uFEFF');
    });

    it('should return the text as is if it is empty and already has a BOM', () => {
      // Arrange
      const text = '\uFEFF';
      (StringUtils.hasBom as jest.Mock).mockReturnValue(true);

      // Act
      const result = FileUtils.getTextWithByteOrderMark(text);

      // Assert
      expect(result).toBe(text);
    });

    it('should handle text with special characters correctly', () => {
      // Arrange
      const text = 'こんにちは世界';
      (StringUtils.hasBom as jest.Mock).mockReturnValue(false);

      // Act
      const result = FileUtils.getTextWithByteOrderMark(text);

      // Assert
      expect(result).toBe('\uFEFF' + text);
    });

    it('should handle text with only whitespace correctly', () => {
      // Arrange
      const text = '   ';
      (StringUtils.hasBom as jest.Mock).mockReturnValue(false);

      // Act
      const result = FileUtils.getTextWithByteOrderMark(text);

      // Assert
      expect(result).toBe('\uFEFF' + text);
    });

    it('should handle text with mixed content correctly', () => {
      // Arrange
      const text = 'Hello, こんにちは, 123!';
      (StringUtils.hasBom as jest.Mock).mockReturnValue(false);

      // Act
      const result = FileUtils.getTextWithByteOrderMark(text);

      // Assert
      expect(result).toBe('\uFEFF' + text);
    });
  });
});

// End of unit tests for: getTextWithByteOrderMark
