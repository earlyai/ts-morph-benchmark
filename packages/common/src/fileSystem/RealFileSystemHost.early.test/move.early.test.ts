
// Unit tests for: move


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      move: jest.fn(),
      moveSync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.move() move method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should move a file from source to destination successfully', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      (runtime.fs.move as jest.Mock).mockResolvedValue(undefined);

      // Act
      await fileSystemHost.move(srcPath, destPath);

      // Assert
      expect(runtime.fs.move).toHaveBeenCalledWith(srcPath, destPath);
    });
  });

  describe('Edge Cases', () => {
    test('should throw an error if source path does not exist', async () => {
      // Arrange
      const srcPath = 'path/to/nonexistent/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      const error = new Error('Source path does not exist');
      (runtime.fs.move as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.move(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.move).toHaveBeenCalledWith(srcPath, destPath);
    });

    test('should throw an error if destination path is invalid', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/invalid/destination/file.txt';
      const error = new Error('Invalid destination path');
      (runtime.fs.move as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.move(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.move).toHaveBeenCalledWith(srcPath, destPath);
    });

    test('should handle permission denied error gracefully', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      const error = new Error('Permission denied');
      (runtime.fs.move as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.move(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.move).toHaveBeenCalledWith(srcPath, destPath);
    });

    test('should handle file system errors gracefully', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      const error = new Error('File system error');
      (runtime.fs.move as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.move(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.move).toHaveBeenCalledWith(srcPath, destPath);
    });
  });
});

// End of unit tests for: move
