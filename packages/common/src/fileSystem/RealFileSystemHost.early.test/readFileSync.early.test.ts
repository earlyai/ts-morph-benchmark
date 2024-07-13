
// Unit tests for: readFileSync

import { errors } from "../../errors";

import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      readFileSync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.readFileSync() readFileSync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should read file content successfully with default encoding', () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      const fileContent = 'file content';
      (runtime.fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      // Act
      const result = fileSystemHost.readFileSync(filePath);

      // Assert
      expect(result).toBe(fileContent);
      expect(runtime.fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    test('should read file content successfully with specified encoding', () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      const encoding = 'ascii';
      const fileContent = 'file content';
      (runtime.fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

      // Act
      const result = fileSystemHost.readFileSync(filePath, encoding);

      // Assert
      expect(result).toBe(fileContent);
      expect(runtime.fs.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });
  });

  describe('Edge Cases', () => {
//    test('should throw FileNotFoundError if file does not exist', () => {
//      // Arrange
//      const filePath = 'path/to/nonexistent-file.txt';
//      const error = new Error('File not found');
//      (runtime.fs.readFileSync as jest.Mock).mockImplementation(() => {
//        throw error;
//      });
//      jest.spyOn(FileUtils, 'isNotExistsError').mockReturnValue(true);
//      jest.spyOn(FileUtils, 'getStandardizedAbsolutePath').mockReturnValue(filePath);
//
//      // Act & Assert
//      expect(() => fileSystemHost.readFileSync(filePath)).toThrow(errors.FileNotFoundError);
//      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
//      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, filePath);
//    });

    test('should rethrow error if it is not a file not found error', () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      const error = new Error('Some other error');
      (runtime.fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw error;
      });
      jest.spyOn(FileUtils, 'isNotExistsError').mockReturnValue(false);

      // Act & Assert
      expect(() => fileSystemHost.readFileSync(filePath)).toThrow(error);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
    });

    test('should handle empty file path', () => {
      // Arrange
      const filePath = '';
      const error = new Error('Invalid file path');
      (runtime.fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => fileSystemHost.readFileSync(filePath)).toThrow(error);
    });

    test('should handle null file path', () => {
      // Arrange
      const filePath = null as unknown as string;
      const error = new Error('Invalid file path');
      (runtime.fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => fileSystemHost.readFileSync(filePath)).toThrow(error);
    });

    test('should handle undefined file path', () => {
      // Arrange
      const filePath = undefined as unknown as string;
      const error = new Error('Invalid file path');
      (runtime.fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => fileSystemHost.readFileSync(filePath)).toThrow(error);
    });
  });
});

// End of unit tests for: readFileSync
