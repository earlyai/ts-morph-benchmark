
// Unit tests for: readFileOrNotExists



import { FileSystemHost } from "../FileSystemHost";

import { StandardizedFilePath } from "../StandardizedFilePath";


import { FileUtils } from '../FileUtils';


describe('FileUtils.readFileOrNotExists() readFileOrNotExists method', () => {
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
    } as unknown as jest.Mocked<FileSystemHost>;
  });

  describe('Happy Path', () => {
    test('should return file content when file exists', async () => {
      const filePath: StandardizedFilePath = 'path/to/file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const fileContent = 'file content';

      mockFileSystem.readFile.mockResolvedValue(fileContent);

      const result = await FileUtils.readFileOrNotExists(mockFileSystem, filePath, encoding);

      expect(result).toBe(fileContent);
      expect(mockFileSystem.readFile).toHaveBeenCalledWith(filePath, encoding);
    });
  });

  describe('Edge Cases', () => {
    test('should return false when file does not exist', async () => {
      const filePath: StandardizedFilePath = 'path/to/nonexistent-file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = { code: FileUtils.ENOENT };

      mockFileSystem.readFile.mockRejectedValue(error);

      const result = await FileUtils.readFileOrNotExists(mockFileSystem, filePath, encoding);

      expect(result).toBe(false);
      expect(mockFileSystem.readFile).toHaveBeenCalledWith(filePath, encoding);
    });

    test('should throw error when an unexpected error occurs', async () => {
      const filePath: StandardizedFilePath = 'path/to/file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = new Error('Unexpected error');

      mockFileSystem.readFile.mockRejectedValue(error);

      await expect(FileUtils.readFileOrNotExists(mockFileSystem, filePath, encoding)).rejects.toThrow('Unexpected error');
      expect(mockFileSystem.readFile).toHaveBeenCalledWith(filePath, encoding);
    });

    test('should handle Deno NotFound error gracefully', async () => {
      const filePath: StandardizedFilePath = 'path/to/nonexistent-file.txt' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = { constructor: { name: 'NotFound' } };

      mockFileSystem.readFile.mockRejectedValue(error);

      const result = await FileUtils.readFileOrNotExists(mockFileSystem, filePath, encoding);

      expect(result).toBe(false);
      expect(mockFileSystem.readFile).toHaveBeenCalledWith(filePath, encoding);
    });
  });
});

// End of unit tests for: readFileOrNotExists
