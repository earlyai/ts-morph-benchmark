
// Unit tests for: acquireDocument



import { ts } from "../../typescript";

import { createCompilerSourceFile } from "../createCompilerSourceFile";

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

describe('DocumentRegistry.acquireDocument() acquireDocument method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    it('should create a new source file if it does not exist in the cache', () => {
      // Arrange
      const fileName = 'testFile.ts';
      const compilationSettings = {} as ts.CompilerOptions;
      const scriptSnapshot = {} as ts.IScriptSnapshot;
      const version = '1';
      const scriptKind = ts.ScriptKind.TS;
      const standardizedFilePath: MockStandardizedFilePath = 'standardized/testFile.ts';
      const mockSourceFile = {} as ts.SourceFile;

      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile as any);

      // Act
      const result = documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version, scriptKind);

      // Assert
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(standardizedFilePath, scriptSnapshot, compilationSettings.target, version, true, scriptKind);
      expect(result).toBe(mockSourceFile);
    });

//    it('should return the existing source file if it exists in the cache and version matches', () => {
//      // Arrange
//      const fileName = 'testFile.ts';
//      const compilationSettings = {} as ts.CompilerOptions;
//      const scriptSnapshot = {} as ts.IScriptSnapshot;
//      const version = '1';
//      const scriptKind = ts.ScriptKind.TS;
//      const standardizedFilePath: MockStandardizedFilePath = 'standardized/testFile.ts';
//      const mockSourceFile = { version: '1' } as ts.SourceFile;
//
//      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
//      documentRegistry['#sourceFileCacheByFilePath'].set(standardizedFilePath as any, mockSourceFile);
//
//      // Act
//      const result = documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version, scriptKind);
//
//      // Assert
//      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
//      expect(result).toBe(mockSourceFile);
//    });
  });

  describe('Edge Cases', () => {
//    it('should update the source file if the version does not match', () => {
//      // Arrange
//      const fileName = 'testFile.ts';
//      const compilationSettings = {} as ts.CompilerOptions;
//      const scriptSnapshot = {} as ts.IScriptSnapshot;
//      const version = '2';
//      const scriptKind = ts.ScriptKind.TS;
//      const standardizedFilePath: MockStandardizedFilePath = 'standardized/testFile.ts';
//      const existingSourceFile = { version: '1' } as ts.SourceFile;
//      const updatedSourceFile = { version: '2' } as ts.SourceFile;
//
//      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
//      documentRegistry['#sourceFileCacheByFilePath'].set(standardizedFilePath as any, existingSourceFile);
//      (createCompilerSourceFile as jest.Mock).mockReturnValue(updatedSourceFile as any);
//
//      // Act
//      const result = documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version, scriptKind);
//
//      // Assert
//      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
//      expect(createCompilerSourceFile).toHaveBeenCalledWith(standardizedFilePath, scriptSnapshot, compilationSettings.target, version, true, scriptKind);
//      expect(result).toBe(updatedSourceFile);
//    });

    it('should handle undefined scriptKind gracefully', () => {
      // Arrange
      const fileName = 'testFile.ts';
      const compilationSettings = {} as ts.CompilerOptions;
      const scriptSnapshot = {} as ts.IScriptSnapshot;
      const version = '1';
      const scriptKind = undefined;
      const standardizedFilePath: MockStandardizedFilePath = 'standardized/testFile.ts';
      const mockSourceFile = {} as ts.SourceFile;

      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile as any);

      // Act
      const result = documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version, scriptKind);

      // Assert
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(standardizedFilePath, scriptSnapshot, compilationSettings.target, version, true, scriptKind);
      expect(result).toBe(mockSourceFile);
    });

    it('should handle empty scriptSnapshot gracefully', () => {
      // Arrange
      const fileName = 'testFile.ts';
      const compilationSettings = {} as ts.CompilerOptions;
      const scriptSnapshot = {} as ts.IScriptSnapshot;
      const version = '1';
      const scriptKind = ts.ScriptKind.TS;
      const standardizedFilePath: MockStandardizedFilePath = 'standardized/testFile.ts';
      const mockSourceFile = {} as ts.SourceFile;

      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile as any);

      // Act
      const result = documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version, scriptKind);

      // Assert
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(standardizedFilePath, scriptSnapshot, compilationSettings.target, version, true, scriptKind);
      expect(result).toBe(mockSourceFile);
    });
  });
});

// End of unit tests for: acquireDocument
