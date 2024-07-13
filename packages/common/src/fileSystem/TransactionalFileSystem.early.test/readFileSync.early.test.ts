
// Unit tests for: readFileSync



import { errors } from "../../errors";



import { FileSystemHost } from "../FileSystemHost";


import { StandardizedFilePath } from "../StandardizedFilePath";



jest.mock('../../getLibFiles', () => {
  const actual = jest.requireActual('../../getLibFiles');
  return {
    ...actual,
    getLibFiles: jest.fn(),
    getLibFolderPath: jest.fn(),
  };
});

class MockFileSystemHost implements FileSystemHost {
  isCaseSensitive = jest.fn();
  delete = jest.fn();
  deleteSync = jest.fn();
  readDirSync = jest.fn();
  readFile = jest.fn();
  readFileSync = jest.fn();
  writeFile = jest.fn();
  writeFileSync = jest.fn();
  mkdir = jest.fn();
  mkdirSync = jest.fn();
  move = jest.fn();
  moveSync = jest.fn();
  copy = jest.fn();
  copySync = jest.fn();
  fileExists = jest.fn();
  fileExistsSync = jest.fn();
  directoryExists = jest.fn();
  directoryExistsSync = jest.fn();
  realpathSync = jest.fn();
  getCurrentDirectory = jest.fn();
  glob = jest.fn();
  globSync = jest.fn();
}

class MockTransactionalFileSystem {
  private fileSystem: FileSystemHost;
  constructor(fileSystem: FileSystemHost) {
    this.fileSystem = fileSystem;
  }

  readLibFile = jest.fn();
  verifyCanReadFile = jest.fn();

  readFileSync(filePath: StandardizedFilePath, encoding: string | undefined) {
    const libFileText = this.readLibFile(filePath);
    if (libFileText != null) return libFileText;

    this.verifyCanReadFile(filePath);
    return this.fileSystem.readFileSync(filePath, encoding);
  }
}

describe('TransactionalFileSystem.readFileSync() readFileSync method', () => {
  let mockFileSystemHost: MockFileSystemHost;
  let mockTransactionalFileSystem: MockTransactionalFileSystem;

  beforeEach(() => {
    mockFileSystemHost = new MockFileSystemHost();
    mockTransactionalFileSystem = new MockTransactionalFileSystem(mockFileSystemHost as any);
  });

  describe('Happy Path', () => {
    it('should return the content of a library file if it exists', () => {
      // Arrange
      const filePath = 'some/path' as StandardizedFilePath;
      const encoding = 'utf-8';
      const libFileContent = 'library file content';
      mockTransactionalFileSystem.readLibFile.mockReturnValue(libFileContent);

      // Act
      const result = mockTransactionalFileSystem.readFileSync(filePath, encoding);

      // Assert
      expect(result).toBe(libFileContent);
      expect(mockTransactionalFileSystem.readLibFile).toHaveBeenCalledWith(filePath);
      expect(mockFileSystemHost.readFileSync).not.toHaveBeenCalled();
    });

    it('should read the file from the file system if it is not a library file', () => {
      // Arrange
      const filePath = 'some/path' as StandardizedFilePath;
      const encoding = 'utf-8';
      const fileContent = 'file system content';
      mockTransactionalFileSystem.readLibFile.mockReturnValue(null);
      mockFileSystemHost.readFileSync.mockReturnValue(fileContent);

      // Act
      const result = mockTransactionalFileSystem.readFileSync(filePath, encoding);

      // Assert
      expect(result).toBe(fileContent);
      expect(mockTransactionalFileSystem.readLibFile).toHaveBeenCalledWith(filePath);
      expect(mockFileSystemHost.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined encoding gracefully', () => {
      // Arrange
      const filePath = 'some/path' as StandardizedFilePath;
      const fileContent = 'file system content';
      mockTransactionalFileSystem.readLibFile.mockReturnValue(null);
      mockFileSystemHost.readFileSync.mockReturnValue(fileContent);

      // Act
      const result = mockTransactionalFileSystem.readFileSync(filePath, undefined);

      // Assert
      expect(result).toBe(fileContent);
      expect(mockTransactionalFileSystem.readLibFile).toHaveBeenCalledWith(filePath);
      expect(mockFileSystemHost.readFileSync).toHaveBeenCalledWith(filePath, undefined);
    });

    it('should throw an error if verifyCanReadFile fails', () => {
      // Arrange
      const filePath = 'some/path' as StandardizedFilePath;
      const error = new Error('Cannot read file');
      mockTransactionalFileSystem.readLibFile.mockReturnValue(null);
      mockTransactionalFileSystem.verifyCanReadFile.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => mockTransactionalFileSystem.readFileSync(filePath, 'utf-8')).toThrow(error);
      expect(mockTransactionalFileSystem.readLibFile).toHaveBeenCalledWith(filePath);
      expect(mockTransactionalFileSystem.verifyCanReadFile).toHaveBeenCalledWith(filePath);
      expect(mockFileSystemHost.readFileSync).not.toHaveBeenCalled();
    });

    it('should handle non-existent files gracefully', () => {
      // Arrange
      const filePath = 'non/existent/path' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = new errors.FileNotFoundError(filePath);
      mockTransactionalFileSystem.readLibFile.mockReturnValue(null);
      mockFileSystemHost.readFileSync.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => mockTransactionalFileSystem.readFileSync(filePath, encoding)).toThrow(error);
      expect(mockTransactionalFileSystem.readLibFile).toHaveBeenCalledWith(filePath);
      expect(mockTransactionalFileSystem.verifyCanReadFile).toHaveBeenCalledWith(filePath);
      expect(mockFileSystemHost.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });
  });
});

// End of unit tests for: readFileSync
