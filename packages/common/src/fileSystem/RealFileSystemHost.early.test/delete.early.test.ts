
// Unit tests for: delete

import { errors } from "../../errors";

import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      delete: jest.fn(),
      deleteSync: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    isNotExistsError: jest.fn(),
    getStandardizedAbsolutePath: jest.fn(),
  },
}));

describe('RealFileSystemHost.delete() delete method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should delete a file successfully', async () => {
      // Arrange
      const path = 'path/to/file.txt';
      (runtime.fs.delete as jest.Mock).mockResolvedValue(undefined);

      // Act
      await fileSystemHost.delete(path);

      // Assert
      expect(runtime.fs.delete).toHaveBeenCalledWith(path);
    });

    it('should delete a file synchronously successfully', () => {
      // Arrange
      const path = 'path/to/file.txt';
      (runtime.fs.deleteSync as jest.Mock).mockReturnValue(undefined);

      // Act
      fileSystemHost.deleteSync(path);

      // Assert
      expect(runtime.fs.deleteSync).toHaveBeenCalledWith(path);
    });
  });

  describe('Edge Cases', () => {
    it('should throw a FileNotFoundError if the file does not exist (async)', async () => {
      // Arrange
      const path = 'path/to/nonexistent-file.txt';
      const error = new Error('File not found');
      (runtime.fs.delete as jest.Mock).mockRejectedValue(error);
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(true);
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(path);

      // Act & Assert
      await expect(fileSystemHost.delete(path)).rejects.toThrow(errors.FileNotFoundError);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, path);
    });

    it('should throw a FileNotFoundError if the file does not exist (sync)', () => {
      // Arrange
      const path = 'path/to/nonexistent-file.txt';
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

    it('should rethrow the error if it is not a file not found error (async)', async () => {
      // Arrange
      const path = 'path/to/file.txt';
      const error = new Error('Some other error');
      (runtime.fs.delete as jest.Mock).mockRejectedValue(error);
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(false);

      // Act & Assert
      await expect(fileSystemHost.delete(path)).rejects.toThrow(error);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
    });

    it('should rethrow the error if it is not a file not found error (sync)', () => {
      // Arrange
      const path = 'path/to/file.txt';
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

// End of unit tests for: delete
