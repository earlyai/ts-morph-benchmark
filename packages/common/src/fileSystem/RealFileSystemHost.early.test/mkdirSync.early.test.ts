
// Unit tests for: mkdirSync


import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      mkdirSync: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    getStandardizedAbsolutePath: jest.fn((host, path) => path),
  },
}));

describe('RealFileSystemHost.mkdirSync() mkdirSync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test.skip('should create a directory successfully', () => {
      // Arrange
      const dirPath = '/path/to/dir';
      const standardizedPath = '/standardized/path/to/dir';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(standardizedPath);

      // Act
      fileSystemHost.mkdirSync(dirPath);

      // Assert
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, dirPath);
      expect(runtime.fs.mkdirSync).toHaveBeenCalledWith(standardizedPath);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should handle error when directory creation fails', () => {
      // Arrange
      const dirPath = '/path/to/dir';
      const standardizedPath = '/standardized/path/to/dir';
      const error = new Error('Failed to create directory');
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(standardizedPath);
      (runtime.fs.mkdirSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => fileSystemHost.mkdirSync(dirPath)).toThrow(error);
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, dirPath);
      expect(runtime.fs.mkdirSync).toHaveBeenCalledWith(standardizedPath);
    });

    test.skip('should handle empty directory path', () => {
      // Arrange
      const dirPath = '';
      const standardizedPath = '';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(standardizedPath);

      // Act
      fileSystemHost.mkdirSync(dirPath);

      // Assert
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, dirPath);
      expect(runtime.fs.mkdirSync).toHaveBeenCalledWith(standardizedPath);
    });

    test.skip('should handle directory path with special characters', () => {
      // Arrange
      const dirPath = '/path/to/dir with spaces and !@#$%^&*()';
      const standardizedPath = '/standardized/path/to/dir with spaces and !@#$%^&*()';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(standardizedPath);

      // Act
      fileSystemHost.mkdirSync(dirPath);

      // Assert
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, dirPath);
      expect(runtime.fs.mkdirSync).toHaveBeenCalledWith(standardizedPath);
    });
  });
});

// End of unit tests for: mkdirSync
