
// Unit tests for: directoryExistsSync


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      statSync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.directoryExistsSync() directoryExistsSync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should return true when the directory exists', () => {
      // Arrange
      const dirPath = '/existing-directory';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => true,
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(true);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });

    test('should return false when the path exists but is not a directory', () => {
      // Arrange
      const dirPath = '/existing-file';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => false,
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('Edge Cases', () => {
    test('should return false when the directory does not exist', () => {
      // Arrange
      const dirPath = '/non-existing-directory';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });

    test('should return false when an unexpected error occurs', () => {
      // Arrange
      const dirPath = '/unexpected-error-directory';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });

    test('should handle paths with special characters', () => {
      // Arrange
      const dirPath = '/special-!@#$%^&*()-_=+[]{};,.<>?`~directory';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => true,
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(true);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });

    test('should handle very long directory paths', () => {
      // Arrange
      const dirPath = '/a'.repeat(300);
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => true,
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(true);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });
  });
});

// End of unit tests for: directoryExistsSync
