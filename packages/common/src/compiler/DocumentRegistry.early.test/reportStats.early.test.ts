
// Unit tests for: reportStats

import { errors } from "../../errors";


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

describe('DocumentRegistry.reportStats() reportStats method', () => {
  let mockTransactionalFileSystem: MockTransactionalFileSystem;
  let documentRegistry: DocumentRegistry;

  beforeEach(() => {
    mockTransactionalFileSystem = new MockTransactionalFileSystem();
    documentRegistry = new DocumentRegistry(mockTransactionalFileSystem as any);
  });

  describe('Happy Path', () => {
    test('should throw NotImplementedError when reportStats is called', () => {
      // Arrange
      const expectedError = new errors.NotImplementedError();

      // Act & Assert
      expect(() => documentRegistry.reportStats()).toThrow(expectedError);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should throw NotImplementedError even if the internal state is modified', () => {
      // Arrange
      const mockFilePath: MockStandardizedFilePath = 'mock/path' as any;
      const mockSourceFile: ts.SourceFile = {} as any;
      documentRegistry['#sourceFileCacheByFilePath'].set(mockFilePath, mockSourceFile);
      const expectedError = new errors.NotImplementedError();

      // Act & Assert
      expect(() => documentRegistry.reportStats()).toThrow(expectedError);
    });
  });
});

// End of unit tests for: reportStats
