
// Unit tests for: acquireDocumentWithKey



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

type MockPath = string;
type MockDocumentRegistryBucketKey = string;
type MockStandardizedFilePath = string;

class MockTransactionalFileSystem {
  getStandardizedAbsolutePath = jest.fn();
}

describe('DocumentRegistry.acquireDocumentWithKey() acquireDocumentWithKey method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    it('should acquire a new document when it does not exist in the cache', () => {
      // Arrange
      const fileName = 'testFile.ts';
      const path: MockPath = 'mockPath';
      const compilationSettings = {} as ts.CompilerOptions;
      const key: MockDocumentRegistryBucketKey = 'mockKey';
      const scriptSnapshot = {} as ts.IScriptSnapshot;
      const version = '1';
      const scriptKind = ts.ScriptKind.TS;
      const standardizedFilePath: MockStandardizedFilePath = 'standardizedPath';
      const mockSourceFile = {} as ts.SourceFile;

      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile as any);

      // Act
      const result = documentRegistry.acquireDocumentWithKey(
        fileName,
        path as any,
        compilationSettings,
        key as any,
        scriptSnapshot,
        version,
        scriptKind
      );

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(
        standardizedFilePath,
        scriptSnapshot,
        compilationSettings.target,
        version,
        true,
        scriptKind
      );
    });

//    it('should return the cached document if it exists and version matches', () => {
//      // Arrange
//      const fileName = 'testFile.ts';
//      const path: MockPath = 'mockPath';
//      const compilationSettings = {} as ts.CompilerOptions;
//      const key: MockDocumentRegistryBucketKey = 'mockKey';
//      const scriptSnapshot = {} as ts.IScriptSnapshot;
//      const version = '1';
//      const scriptKind = ts.ScriptKind.TS;
//      const standardizedFilePath: MockStandardizedFilePath = 'standardizedPath';
//      const mockSourceFile = { version } as ts.SourceFile;
//
//      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
//      documentRegistry['#sourceFileCacheByFilePath'].set(standardizedFilePath, mockSourceFile);
//
//      // Act
//      const result = documentRegistry.acquireDocumentWithKey(
//        fileName,
//        path as any,
//        compilationSettings,
//        key as any,
//        scriptSnapshot,
//        version,
//        scriptKind
//      );
//
//      // Assert
//      expect(result).toBe(mockSourceFile);
//      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
//      expect(createCompilerSourceFile).not.toHaveBeenCalled();
//    });
  });

  describe('Edge Cases', () => {
//    it('should update the document if the version does not match', () => {
//      // Arrange
//      const fileName = 'testFile.ts';
//      const path: MockPath = 'mockPath';
//      const compilationSettings = {} as ts.CompilerOptions;
//      const key: MockDocumentRegistryBucketKey = 'mockKey';
//      const scriptSnapshot = {} as ts.IScriptSnapshot;
//      const version = '2';
//      const scriptKind = ts.ScriptKind.TS;
//      const standardizedFilePath: MockStandardizedFilePath = 'standardizedPath';
//      const mockSourceFile = { version: '1' } as ts.SourceFile;
//      const updatedSourceFile = {} as ts.SourceFile;
//
//      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
//      documentRegistry['#sourceFileCacheByFilePath'].set(standardizedFilePath, mockSourceFile);
//      (createCompilerSourceFile as jest.Mock).mockReturnValue(updatedSourceFile as any);
//
//      // Act
//      const result = documentRegistry.acquireDocumentWithKey(
//        fileName,
//        path as any,
//        compilationSettings,
//        key as any,
//        scriptSnapshot,
//        version,
//        scriptKind
//      );
//
//      // Assert
//      expect(result).toBe(updatedSourceFile);
//      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
//      expect(createCompilerSourceFile).toHaveBeenCalledWith(
//        standardizedFilePath,
//        scriptSnapshot,
//        compilationSettings.target,
//        version,
//        true,
//        scriptKind
//      );
//    });

    it('should handle undefined scriptKind gracefully', () => {
      // Arrange
      const fileName = 'testFile.ts';
      const path: MockPath = 'mockPath';
      const compilationSettings = {} as ts.CompilerOptions;
      const key: MockDocumentRegistryBucketKey = 'mockKey';
      const scriptSnapshot = {} as ts.IScriptSnapshot;
      const version = '1';
      const scriptKind = undefined;
      const standardizedFilePath: MockStandardizedFilePath = 'standardizedPath';
      const mockSourceFile = {} as ts.SourceFile;

      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile as any);

      // Act
      const result = documentRegistry.acquireDocumentWithKey(
        fileName,
        path as any,
        compilationSettings,
        key as any,
        scriptSnapshot,
        version,
        scriptKind
      );

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(
        standardizedFilePath,
        scriptSnapshot,
        compilationSettings.target,
        version,
        true,
        scriptKind
      );
    });

    it('should handle empty fileName gracefully', () => {
      // Arrange
      const fileName = '';
      const path: MockPath = 'mockPath';
      const compilationSettings = {} as ts.CompilerOptions;
      const key: MockDocumentRegistryBucketKey = 'mockKey';
      const scriptSnapshot = {} as ts.IScriptSnapshot;
      const version = '1';
      const scriptKind = ts.ScriptKind.TS;
      const standardizedFilePath: MockStandardizedFilePath = 'standardizedPath';
      const mockSourceFile = {} as ts.SourceFile;

      mockTransactionalFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedFilePath as any);
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile as any);

      // Act
      const result = documentRegistry.acquireDocumentWithKey(
        fileName,
        path as any,
        compilationSettings,
        key as any,
        scriptSnapshot,
        version,
        scriptKind
      );

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(mockTransactionalFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileName);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(
        standardizedFilePath,
        scriptSnapshot,
        compilationSettings.target,
        version,
        true,
        scriptKind
      );
    });
  });
});

// End of unit tests for: acquireDocumentWithKey
