
// Unit tests for: fileExistsSync


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      statSync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.fileExistsSync() fileExistsSync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should return true when the file exists', () => {
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

    test('should return false when the path exists but is not a file', () => {
      // Arrange
      const filePath = 'path/to/existing/directory';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isFile: () => false,
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });
  });

  describe('Edge Cases', () => {
    test('should return false when the file does not exist', () => {
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

    test('should return false when an unexpected error occurs', () => {
      // Arrange
      const filePath = 'path/to/file/with/error.txt';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });

    test('should handle null or undefined filePath gracefully', () => {
      // Arrange
      const filePath = null as unknown as string;
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid path');
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });

    test('should handle empty string filePath gracefully', () => {
      // Arrange
      const filePath = '';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid path');
      });

      // Act
      const result = fileSystemHost.fileExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });
  });
});

// End of unit tests for: fileExistsSync
