
// Unit tests for: copy


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      copy: jest.fn(),
      copySync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.copy() copy method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should copy a file from srcPath to destPath successfully', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      (runtime.fs.copy as jest.Mock).mockResolvedValue(undefined);

      // Act
      await fileSystemHost.copy(srcPath, destPath);

      // Assert
      expect(runtime.fs.copy).toHaveBeenCalledWith(srcPath, destPath);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if srcPath does not exist', async () => {
      // Arrange
      const srcPath = 'path/to/nonexistent/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      const error = new Error('File not found');
      (runtime.fs.copy as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.copy(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.copy).toHaveBeenCalledWith(srcPath, destPath);
    });

    it('should throw an error if destPath is invalid', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/invalid/destination/file.txt';
      const error = new Error('Invalid destination path');
      (runtime.fs.copy as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.copy(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.copy).toHaveBeenCalledWith(srcPath, destPath);
    });

    it('should handle permission errors gracefully', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      const error = new Error('Permission denied');
      (runtime.fs.copy as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.copy(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.copy).toHaveBeenCalledWith(srcPath, destPath);
    });

    it('should handle network errors gracefully', async () => {
      // Arrange
      const srcPath = 'path/to/source/file.txt';
      const destPath = 'path/to/destination/file.txt';
      const error = new Error('Network error');
      (runtime.fs.copy as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.copy(srcPath, destPath)).rejects.toThrow(error);
      expect(runtime.fs.copy).toHaveBeenCalledWith(srcPath, destPath);
    });
  });
});

// End of unit tests for: copy
