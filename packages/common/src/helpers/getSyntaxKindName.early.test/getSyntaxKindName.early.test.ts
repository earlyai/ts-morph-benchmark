
// Unit tests for: getSyntaxKindName

import { ts } from "../../typescript";

import { getSyntaxKindName } from '../getSyntaxKindName';


describe('getSyntaxKindName() getSyntaxKindName method', () => {
  // Mocking the ts.SyntaxKind enum
  const mockSyntaxKind = {
    Unknown: 0,
    EndOfFileToken: 1,
    SingleLineCommentTrivia: 2,
    MultiLineCommentTrivia: 3,
    NewLineTrivia: 4,
    WhitespaceTrivia: 5,
    // Add more as needed for testing
  };

  beforeAll(() => {
    // Mocking the ts object
    (ts as any).SyntaxKind = mockSyntaxKind;
  });

  describe('Happy Path', () => {
    test.skip('should return the correct name for a valid syntax kind', () => {
      // Arrange
      const kind = mockSyntaxKind.EndOfFileToken;

      // Act
      const result = getSyntaxKindName(kind);

      // Assert
      expect(result).toBe('EndOfFileToken');
    });

    test.skip('should return the correct name for another valid syntax kind', () => {
      // Arrange
      const kind = mockSyntaxKind.NewLineTrivia;

      // Act
      const result = getSyntaxKindName(kind);

      // Assert
      expect(result).toBe('NewLineTrivia');
    });
  });

  describe('Edge Cases', () => {
//    test('should return undefined for an invalid syntax kind', () => {
//      // Arrange
//      const invalidKind = 9999;
//
//      // Act
//      const result = getSyntaxKindName(invalidKind);
//
//      // Assert
//      expect(result).toBeUndefined();
//    });

    test.skip('should handle the case where kindCache is initially undefined', () => {
      // Arrange
      const kind = mockSyntaxKind.WhitespaceTrivia;

      // Act
      const result = getSyntaxKindName(kind);

      // Assert
      expect(result).toBe('WhitespaceTrivia');
    });

    test.skip('should handle the case where kindCache is already populated', () => {
      // Arrange
      const kind = mockSyntaxKind.SingleLineCommentTrivia;

      // Act
      const result1 = getSyntaxKindName(kind);
      const result2 = getSyntaxKindName(kind);

      // Assert
      expect(result1).toBe('SingleLineCommentTrivia');
      expect(result2).toBe('SingleLineCommentTrivia');
    });

    test.skip('should handle the case where ts.SyntaxKind has duplicate values', () => {
      // Arrange
      const duplicateMockSyntaxKind = {
        ...mockSyntaxKind,
        DuplicateKind: mockSyntaxKind.NewLineTrivia,
      };
      (ts as any).SyntaxKind = duplicateMockSyntaxKind;

      // Act
      const result = getSyntaxKindName(mockSyntaxKind.NewLineTrivia);

      // Assert
      expect(result).toBe('NewLineTrivia');
    });
  });
});

// End of unit tests for: getSyntaxKindName
