
// Unit tests for: fileExists


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      stat: jest.fn(),
      statSync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.fileExists() fileExists method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should return true when the file exists (async)', async () => {
      // Arrange
      const filePath = 'path/to/existing/file.txt';
      (runtime.fs.stat as jest.Mock).mockResolvedValue({
        isFile: () => true,
      });

      // Act
      const result = await fileSystemHost.fileExists(filePath);

      // Assert
      expect(result).toBe(true);
      expect(runtime.fs.stat).toHaveBeenCalledWith(filePath);
    });

    test('should return true when the file exists (sync)', () => {
      // Arrange
      const filePath = 'path/to/existing/file.txt';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isFile: () => true,
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(true);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });

    test('should return false when the file does not exist (async)', async () => {
      // Arrange
      const filePath = 'path/to/nonexistent/file.txt';
      (runtime.fs.stat as jest.Mock).mockRejectedValue(new Error('File not found'));

      // Act
      const result = await fileSystemHost.fileExists(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.stat).toHaveBeenCalledWith(filePath);
    });

    test('should return false when the file does not exist (sync)', () => {
      // Arrange
      const filePath = 'path/to/nonexistent/file.txt';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });
  });

  describe('Edge Cases', () => {
    test('should return false when the path is a directory (async)', async () => {
      // Arrange
      const dirPath = 'path/to/directory';
      (runtime.fs.stat as jest.Mock).mockResolvedValue({
        isFile: () => false,
        isDirectory: () => true,
      });

      // Act
      const result = await fileSystemHost.fileExists(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.stat).toHaveBeenCalledWith(dirPath);
    });

    test('should return false when the path is a directory (sync)', () => {
      // Arrange
      const dirPath = 'path/to/directory';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isFile: () => false,
        isDirectory: () => true,
      });

      // Act
      const result = fileSystemHost.fileExistsSync(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });

    test('should handle unexpected errors gracefully (async)', async () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      (runtime.fs.stat as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      // Act
      const result = await fileSystemHost.fileExists(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.stat).toHaveBeenCalledWith(filePath);
    });

    test('should handle unexpected errors gracefully (sync)', () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });

    test('should return false for an empty file path (async)', async () => {
      // Arrange
      const filePath = '';
      (runtime.fs.stat as jest.Mock).mockRejectedValue(new Error('File not found'));

      // Act
      const result = await fileSystemHost.fileExists(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.stat).toHaveBeenCalledWith(filePath);
    });

    test('should return false for an empty file path (sync)', () => {
      // Arrange
      const filePath = '';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });
  });
});

// End of unit tests for: fileExists
