
// Unit tests for: removeSourceFile


import { StandardizedFilePath } from "../../fileSystem";

import { ts } from "../../typescript";


import { DocumentRegistry } from '../DocumentRegistry';


jest.mock("../createCompilerSourceFile", () => {
  const actual = jest.requireActual("../createCompilerSourceFile");
  return {
    ...actual,
    createCompilerSourceFile: jest.fn(),
  };
});

class MockTransactionalFileSystem {
  getStandardizedAbsolutePath = jest.fn();
}

describe('DocumentRegistry.removeSourceFile() removeSourceFile method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    test.skip('should remove an existing source file from the cache', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file.ts' as any;
      const mockSourceFile = {} as ts.SourceFile;
      documentRegistry['#sourceFileCacheByFilePath'].set(fileName, mockSourceFile);

      // Act
      documentRegistry.removeSourceFile(fileName);

      // Assert
      expect(documentRegistry['#sourceFileCacheByFilePath'].has(fileName)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should handle removing a non-existent source file gracefully', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'nonExistentFile.ts' as any;

      // Act
      documentRegistry.removeSourceFile(fileName);

      // Assert
      expect(documentRegistry['#sourceFileCacheByFilePath'].has(fileName)).toBe(false);
    });

    test.skip('should handle removing a source file when the cache is empty', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file.ts' as any;

      // Act
      documentRegistry.removeSourceFile(fileName);

      // Assert
      expect(documentRegistry['#sourceFileCacheByFilePath'].size).toBe(0);
    });

    test.skip('should handle removing a source file with special characters in the name', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file with special chars @#$%.ts' as any;
      const mockSourceFile = {} as ts.SourceFile;
      documentRegistry['#sourceFileCacheByFilePath'].set(fileName, mockSourceFile);

      // Act
      documentRegistry.removeSourceFile(fileName);

      // Assert
      expect(documentRegistry['#sourceFileCacheByFilePath'].has(fileName)).toBe(false);
    });
  });
});

// End of unit tests for: removeSourceFile
