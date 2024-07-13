
// Unit tests for: readFileOrNotExistsSync



import { FileSystemHost } from "../FileSystemHost";

import { StandardizedFilePath } from "../StandardizedFilePath";


import { FileUtils } from '../FileUtils';


describe('FileUtils.readFileOrNotExistsSync() readFileOrNotExistsSync method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;

  beforeEach(() => {
    mockFileSystem = {
      isCaseSensitive: jest.fn(),
      delete: jest.fn(),
      deleteSync: jest.fn(),
      readDirSync: jest.fn(),
      readFile: jest.fn(),
      readFileSync: jest.fn(),
      writeFile: jest.fn(),
      writeFileSync: jest.fn(),
      mkdir: jest.fn(),
      mkdirSync: jest.fn(),
      move: jest.fn(),
      moveSync: jest.fn(),
      copy: jest.fn(),
      copySync: jest.fn(),
      fileExists: jest.fn(),
      fileExistsSync: jest.fn(),
      directoryExists: jest.fn(),
      directoryExistsSync: jest.fn(),
      realpathSync: jest.fn(),
      getCurrentDirectory: jest.fn(),
      glob: jest.fn(),
      globSync: jest.fn(),
    };
  });

  describe('Happy Path', () => {
    test('should return file content when file exists', () => {
      // Arrange
      const filePath: StandardizedFilePath = 'path/to/file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const fileContent = 'file content';
      mockFileSystem.readFileSync.mockReturnValue(fileContent);

      // Act
      const result = FileUtils.readFileOrNotExistsSync(mockFileSystem, filePath, encoding);

      // Assert
      expect(result).toBe(fileContent);
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });
  });

  describe('Edge Cases', () => {
    test('should return false when file does not exist', () => {
      // Arrange
      const filePath: StandardizedFilePath = 'path/to/nonexistent-file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = { code: FileUtils.ENOENT };
      mockFileSystem.readFileSync.mockImplementation(() => {
        throw error;
      });

      // Act
      const result = FileUtils.readFileOrNotExistsSync(mockFileSystem, filePath, encoding);

      // Assert
      expect(result).toBe(false);
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });

    test('should throw error when an unexpected error occurs', () => {
      // Arrange
      const filePath: StandardizedFilePath = 'path/to/file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = new Error('Unexpected error');
      mockFileSystem.readFileSync.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => FileUtils.readFileOrNotExistsSync(mockFileSystem, filePath, encoding)).toThrow(error);
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });

    test('should handle non-standard error objects gracefully', () => {
      // Arrange
      const filePath: StandardizedFilePath = 'path/to/file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = { constructor: { name: 'NotFound' } };
      mockFileSystem.readFileSync.mockImplementation(() => {
        throw error;
      });

      // Act
      const result = FileUtils.readFileOrNotExistsSync(mockFileSystem, filePath, encoding);

      // Assert
      expect(result).toBe(false);
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });

    test('should handle empty file path gracefully', () => {
      // Arrange
      const filePath: StandardizedFilePath = '' as StandardizedFilePath;
      const encoding = 'utf-8';
      const fileContent = 'file content';
      mockFileSystem.readFileSync.mockReturnValue(fileContent);

      // Act
      const result = FileUtils.readFileOrNotExistsSync(mockFileSystem, filePath, encoding);

      // Assert
      expect(result).toBe(fileContent);
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });

    test('should handle null encoding gracefully', () => {
      // Arrange
      const filePath: StandardizedFilePath = 'path/to/file.txt' as StandardizedFilePath;
      const encoding = null;
      const fileContent = 'file content';
      mockFileSystem.readFileSync.mockReturnValue(fileContent);

      // Act
      const result = FileUtils.readFileOrNotExistsSync(mockFileSystem, filePath, encoding);

      // Assert
      expect(result).toBe(fileContent);
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });
  });
});

// End of unit tests for: readFileOrNotExistsSync
