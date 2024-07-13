
// Unit tests for: deleteSync

import { errors } from "../../errors";

import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      deleteSync: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    getStandardizedAbsolutePath: jest.fn((host, path) => path),
    isNotExistsError: jest.fn(),
  },
}));

describe('RealFileSystemHost.deleteSync() deleteSync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should delete a file successfully', () => {
      // Arrange
      const path = '/path/to/file.txt';
      (runtime.fs.deleteSync as jest.Mock).mockImplementation(() => {});

      // Act
      fileSystemHost.deleteSync(path);

      // Assert
      expect(runtime.fs.deleteSync).toHaveBeenCalledWith(path);
    });
  });

  describe('Edge Cases', () => {
    test('should throw a FileNotFoundError if the file does not exist', () => {
      // Arrange
      const path = '/path/to/nonexistent-file.txt';
      const error = new Error('File not found');
      (runtime.fs.deleteSync as jest.Mock).mockImplementation(() => {
        throw error;
      });
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(true);
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(path);

      // Act & Assert
      expect(() => fileSystemHost.deleteSync(path)).toThrow(errors.FileNotFoundError);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, path);
    });

    test('should rethrow the error if it is not a FileNotFoundError', () => {
      // Arrange
      const path = '/path/to/file.txt';
      const error = new Error('Some other error');
      (runtime.fs.deleteSync as jest.Mock).mockImplementation(() => {
        throw error;
      });
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(false);

      // Act & Assert
      expect(() => fileSystemHost.deleteSync(path)).toThrow(error);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
    });
  });
});

// End of unit tests for: deleteSync
