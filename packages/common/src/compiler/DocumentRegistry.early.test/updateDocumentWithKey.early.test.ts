
// Unit tests for: updateDocumentWithKey



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

describe('DocumentRegistry.updateDocumentWithKey() updateDocumentWithKey method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    it.skip('should update the document with the given key', () => {
      // Arrange
      const fileName: MockStandardizedFilePath = 'file.ts';
      const path: MockPath = 'path/to/file.ts';
      const compilationSettings: ts.CompilerOptions = {};
      const key: MockDocumentRegistryBucketKey = 'someKey';
      const scriptSnapshot: ts.IScriptSnapshot = {
        getText: jest.fn(),
        getLength: jest.fn(),
        getChangeRange: jest.fn(),
      };
      const version = '1';
      const scriptKind = ts.ScriptKind.TS;

      const mockSourceFile = {} as ts.SourceFile;
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.updateDocumentWithKey(
        fileName as any,
        path as any,
        compilationSettings,
        key as any,
        scriptSnapshot,
        version,
        scriptKind
      );

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(
        fileName,
        scriptSnapshot,
        compilationSettings.target,
        version,
        true,
        scriptKind
      );
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle when scriptKind is undefined', () => {
      // Arrange
      const fileName: MockStandardizedFilePath = 'file.ts';
      const path: MockPath = 'path/to/file.ts';
      const compilationSettings: ts.CompilerOptions = {};
      const key: MockDocumentRegistryBucketKey = 'someKey';
      const scriptSnapshot: ts.IScriptSnapshot = {
        getText: jest.fn(),
        getLength: jest.fn(),
        getChangeRange: jest.fn(),
      };
      const version = '1';
      const scriptKind = undefined;

      const mockSourceFile = {} as ts.SourceFile;
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.updateDocumentWithKey(
        fileName as any,
        path as any,
        compilationSettings,
        key as any,
        scriptSnapshot,
        version,
        scriptKind
      );

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(
        fileName,
        scriptSnapshot,
        compilationSettings.target,
        version,
        true,
        scriptKind
      );
    });

    it.skip('should handle when version is an empty string', () => {
      // Arrange
      const fileName: MockStandardizedFilePath = 'file.ts';
      const path: MockPath = 'path/to/file.ts';
      const compilationSettings: ts.CompilerOptions = {};
      const key: MockDocumentRegistryBucketKey = 'someKey';
      const scriptSnapshot: ts.IScriptSnapshot = {
        getText: jest.fn(),
        getLength: jest.fn(),
        getChangeRange: jest.fn(),
      };
      const version = '';
      const scriptKind = ts.ScriptKind.TS;

      const mockSourceFile = {} as ts.SourceFile;
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.updateDocumentWithKey(
        fileName as any,
        path as any,
        compilationSettings,
        key as any,
        scriptSnapshot,
        version,
        scriptKind
      );

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(
        fileName,
        scriptSnapshot,
        compilationSettings.target,
        version,
        true,
        scriptKind
      );
    });

    it.skip('should handle when scriptSnapshot is null', () => {
      // Arrange
      const fileName: MockStandardizedFilePath = 'file.ts';
      const path: MockPath = 'path/to/file.ts';
      const compilationSettings: ts.CompilerOptions = {};
      const key: MockDocumentRegistryBucketKey = 'someKey';
      const scriptSnapshot = null;
      const version = '1';
      const scriptKind = ts.ScriptKind.TS;

      const mockSourceFile = {} as ts.SourceFile;
      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.updateDocumentWithKey(
        fileName as any,
        path as any,
        compilationSettings,
        key as any,
        scriptSnapshot as any,
        version,
        scriptKind
      );

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(
        fileName,
        scriptSnapshot,
        compilationSettings.target,
        version,
        true,
        scriptKind
      );
    });
  });
});

// End of unit tests for: updateDocumentWithKey
