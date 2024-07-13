
// Unit tests for: getKeyForCompilationSettings



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

describe('DocumentRegistry.getKeyForCompilationSettings() getKeyForCompilationSettings method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    it('should return "defaultKey" for any given compilation settings', () => {
      // Arrange
      const compilationSettings: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
      };

      // Act
      const result = documentRegistry.getKeyForCompilationSettings(compilationSettings);

      // Assert
      expect(result).toBe('defaultKey');
    });
  });

  describe('Edge Cases', () => {
    it('should return "defaultKey" when compilation settings are empty', () => {
      // Arrange
      const compilationSettings: ts.CompilerOptions = {};

      // Act
      const result = documentRegistry.getKeyForCompilationSettings(compilationSettings);

      // Assert
      expect(result).toBe('defaultKey');
    });

    it('should return "defaultKey" when compilation settings are null', () => {
      // Arrange
      const compilationSettings: ts.CompilerOptions = null as any;

      // Act
      const result = documentRegistry.getKeyForCompilationSettings(compilationSettings);

      // Assert
      expect(result).toBe('defaultKey');
    });

    it('should return "defaultKey" when compilation settings are undefined', () => {
      // Arrange
      const compilationSettings: ts.CompilerOptions = undefined as any;

      // Act
      const result = documentRegistry.getKeyForCompilationSettings(compilationSettings);

      // Assert
      expect(result).toBe('defaultKey');
    });

    it('should return "defaultKey" when compilation settings contain unexpected properties', () => {
      // Arrange
      const compilationSettings: ts.CompilerOptions = {
        unexpectedProperty: 'unexpectedValue',
      } as any;

      // Act
      const result = documentRegistry.getKeyForCompilationSettings(compilationSettings);

      // Assert
      expect(result).toBe('defaultKey');
    });
  });
});

// End of unit tests for: getKeyForCompilationSettings
