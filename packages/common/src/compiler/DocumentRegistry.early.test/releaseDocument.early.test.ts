
// Unit tests for: releaseDocument



import { ts } from "../../typescript";


import { DocumentRegistry } from '../DocumentRegistry';


jest.mock("../createCompilerSourceFile", () => {
  const actual = jest.requireActual("../createCompilerSourceFile");
  return {
    ...actual,
    createCompilerSourceFile: jest.fn(),
  };
});

type MockStandardizedFilePath = string;

class MockTransactionalFileSystem {
  getStandardizedAbsolutePath = jest.fn();
}

describe('DocumentRegistry.releaseDocument() releaseDocument method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    it.skip('should release a document successfully', () => {
      // Arrange
      const fileName: MockStandardizedFilePath = 'file.ts';
      const compilationSettings: ts.CompilerOptions = {} as any;
      const standardizedFilePath = 'standardized/file.ts';
      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath);

      // Act
      documentRegistry.releaseDocument(fileName, compilationSettings);

      // Assert
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(documentRegistry['#sourceFileCacheByFilePath'].has(standardizedFilePath)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle releasing a document that does not exist', () => {
      // Arrange
      const fileName: MockStandardizedFilePath = 'nonexistentFile.ts';
      const compilationSettings: ts.CompilerOptions = {} as any;
      const standardizedFilePath = 'standardized/nonexistentFile.ts';
      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath);

      // Act
      documentRegistry.releaseDocument(fileName, compilationSettings);

      // Assert
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(documentRegistry['#sourceFileCacheByFilePath'].has(standardizedFilePath)).toBe(false);
    });

    it.skip('should handle releasing a document with an invalid file path', () => {
      // Arrange
      const fileName: MockStandardizedFilePath = '' as any;
      const compilationSettings: ts.CompilerOptions = {} as any;
      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(null);

      // Act
      documentRegistry.releaseDocument(fileName, compilationSettings);

      // Assert
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(documentRegistry['#sourceFileCacheByFilePath'].has(null)).toBe(false);
    });
  });
});

// End of unit tests for: releaseDocument
