
// Unit tests for: directoryExists


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

describe('RealFileSystemHost.directoryExists() directoryExists method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should return true when the directory exists (async)', async () => {
      // Arrange
      const dirPath = '/path/to/existing/dir';
      (runtime.fs.stat as jest.Mock).mockResolvedValue({
        isDirectory: () => true,
      });

      // Act
      const result = await fileSystemHost.directoryExists(dirPath);

      // Assert
      expect(result).toBe(true);
      expect(runtime.fs.stat).toHaveBeenCalledWith(dirPath);
    });

    it('should return true when the directory exists (sync)', () => {
      // Arrange
      const dirPath = '/path/to/existing/dir';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => true,
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(true);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });

    it('should return false when the directory does not exist (async)', async () => {
      // Arrange
      const dirPath = '/path/to/nonexistent/dir';
      (runtime.fs.stat as jest.Mock).mockRejectedValue(new Error('Not found'));

      // Act
      const result = await fileSystemHost.directoryExists(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.stat).toHaveBeenCalledWith(dirPath);
    });

    it('should return false when the directory does not exist (sync)', () => {
      // Arrange
      const dirPath = '/path/to/nonexistent/dir';
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('Not found');
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('Edge Cases', () => {
    it('should return false when the path is a file (async)', async () => {
      // Arrange
      const filePath = '/path/to/file';
      (runtime.fs.stat as jest.Mock).mockResolvedValue({
        isDirectory: () => false,
      });

      // Act
      const result = await fileSystemHost.directoryExists(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.stat).toHaveBeenCalledWith(filePath);
    });

    it('should return false when the path is a file (sync)', () => {
      // Arrange
      const filePath = '/path/to/file';
      (runtime.fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => false,
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(filePath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(filePath);
    });

    it('should handle unexpected errors gracefully (async)', async () => {
      // Arrange
      const dirPath = '/path/to/dir';
      const unexpectedError = new Error('Unexpected error');
      (runtime.fs.stat as jest.Mock).mockRejectedValue(unexpectedError);

      // Act
      const result = await fileSystemHost.directoryExists(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.stat).toHaveBeenCalledWith(dirPath);
    });

    it('should handle unexpected errors gracefully (sync)', () => {
      // Arrange
      const dirPath = '/path/to/dir';
      const unexpectedError = new Error('Unexpected error');
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw unexpectedError;
      });

      // Act
      const result = fileSystemHost.directoryExistsSync(dirPath);

      // Assert
      expect(result).toBe(false);
      expect(runtime.fs.statSync).toHaveBeenCalledWith(dirPath);
    });
  });
});

// End of unit tests for: directoryExists
