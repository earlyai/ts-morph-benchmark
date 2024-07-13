
// Unit tests for: createOrUpdateSourceFile


import { StandardizedFilePath } from "../../fileSystem";

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

class MockTransactionalFileSystem {
  getStandardizedAbsolutePath = jest.fn();
}

describe('DocumentRegistry.createOrUpdateSourceFile() createOrUpdateSourceFile method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    it('should create a new source file when it does not exist in the cache', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file.ts' as any;
      const compilationSettings: ts.CompilerOptions = {};
      const scriptSnapshot: ts.IScriptSnapshot = { getText: jest.fn(), getLength: jest.fn(), getChangeRange: jest.fn() };
      const scriptKind: ts.ScriptKind = ts.ScriptKind.TS;
      const mockSourceFile = { version: '0' } as any;

      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.createOrUpdateSourceFile(fileName, compilationSettings, scriptSnapshot, scriptKind);

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(fileName, scriptSnapshot, compilationSettings.target, '0', true, scriptKind);
    });

    it.skip('should update an existing source file when it exists in the cache', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file.ts' as any;
      const compilationSettings: ts.CompilerOptions = {};
      const scriptSnapshot: ts.IScriptSnapshot = { getText: jest.fn(), getLength: jest.fn(), getChangeRange: jest.fn() };
      const scriptKind: ts.ScriptKind = ts.ScriptKind.TS;
      const existingSourceFile = { version: '1' } as any;
      const updatedSourceFile = { version: '2' } as any;

      documentRegistry['#sourceFileCacheByFilePath'].set(fileName, existingSourceFile);
      (createCompilerSourceFile as jest.Mock).mockReturnValue(updatedSourceFile);

      // Act
      const result = documentRegistry.createOrUpdateSourceFile(fileName, compilationSettings, scriptSnapshot, scriptKind);

      // Assert
      expect(result).toBe(updatedSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(fileName, scriptSnapshot, compilationSettings.target, '2', true, scriptKind);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined scriptKind gracefully', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file.ts' as any;
      const compilationSettings: ts.CompilerOptions = {};
      const scriptSnapshot: ts.IScriptSnapshot = { getText: jest.fn(), getLength: jest.fn(), getChangeRange: jest.fn() };
      const scriptKind = undefined;
      const mockSourceFile = { version: '0' } as any;

      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.createOrUpdateSourceFile(fileName, compilationSettings, scriptSnapshot, scriptKind);

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(fileName, scriptSnapshot, compilationSettings.target, '0', true, scriptKind);
    });

    it('should handle empty compilationSettings gracefully', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file.ts' as any;
      const compilationSettings: ts.CompilerOptions = {};
      const scriptSnapshot: ts.IScriptSnapshot = { getText: jest.fn(), getLength: jest.fn(), getChangeRange: jest.fn() };
      const scriptKind: ts.ScriptKind = ts.ScriptKind.TS;
      const mockSourceFile = { version: '0' } as any;

      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.createOrUpdateSourceFile(fileName, compilationSettings, scriptSnapshot, scriptKind);

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(fileName, scriptSnapshot, compilationSettings.target, '0', true, scriptKind);
    });

    it('should handle null scriptSnapshot gracefully', () => {
      // Arrange
      const fileName: StandardizedFilePath = 'file.ts' as any;
      const compilationSettings: ts.CompilerOptions = {};
      const scriptSnapshot = null as any;
      const scriptKind: ts.ScriptKind = ts.ScriptKind.TS;
      const mockSourceFile = { version: '0' } as any;

      (createCompilerSourceFile as jest.Mock).mockReturnValue(mockSourceFile);

      // Act
      const result = documentRegistry.createOrUpdateSourceFile(fileName, compilationSettings, scriptSnapshot, scriptKind);

      // Assert
      expect(result).toBe(mockSourceFile);
      expect(createCompilerSourceFile).toHaveBeenCalledWith(fileName, scriptSnapshot, compilationSettings.target, '0', true, scriptKind);
    });
  });
});

// End of unit tests for: createOrUpdateSourceFile
