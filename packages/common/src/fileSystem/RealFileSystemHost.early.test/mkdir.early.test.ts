
// Unit tests for: mkdir


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      mkdir: jest.fn(),
      mkdirSync: jest.fn(),
    },
  },
}));

jest.mock("../../errors", () => ({
  errors: {
    DirectoryNotFoundError: jest.fn(),
    FileNotFoundError: jest.fn(),
    throwNotImplementedForNeverValueError: jest.fn(),
  },
}));

describe('RealFileSystemHost.mkdir() mkdir method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should create a directory successfully', async () => {
      // Arrange
      const dirPath = '/path/to/dir';
      (runtime.fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      // Act
      await fileSystemHost.mkdir(dirPath);

      // Assert
      expect(runtime.fs.mkdir).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('Edge Cases', () => {
    test('should handle error when directory creation fails', async () => {
      // Arrange
      const dirPath = '/path/to/dir';
      const error = new Error('Failed to create directory');
      (runtime.fs.mkdir as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.mkdir(dirPath)).rejects.toThrow(error);
      expect(runtime.fs.mkdir).toHaveBeenCalledWith(dirPath);
    });

    test('should handle empty directory path', async () => {
      // Arrange
      const dirPath = '';
      const error = new Error('Path cannot be empty');
      (runtime.fs.mkdir as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.mkdir(dirPath)).rejects.toThrow(error);
      expect(runtime.fs.mkdir).toHaveBeenCalledWith(dirPath);
    });

    test('should handle directory path with special characters', async () => {
      // Arrange
      const dirPath = '/path/to/dir/with/special/!@#$%^&*()';
      (runtime.fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      // Act
      await fileSystemHost.mkdir(dirPath);

      // Assert
      expect(runtime.fs.mkdir).toHaveBeenCalledWith(dirPath);
    });

    test('should handle directory path with relative path', async () => {
      // Arrange
      const dirPath = './relative/path/to/dir';
      (runtime.fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      // Act
      await fileSystemHost.mkdir(dirPath);

      // Assert
      expect(runtime.fs.mkdir).toHaveBeenCalledWith(dirPath);
    });

    test('should handle directory path with absolute path', async () => {
      // Arrange
      const dirPath = '/absolute/path/to/dir';
      (runtime.fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      // Act
      await fileSystemHost.mkdir(dirPath);

      // Assert
      expect(runtime.fs.mkdir).toHaveBeenCalledWith(dirPath);
    });
  });
});

// End of unit tests for: mkdir
