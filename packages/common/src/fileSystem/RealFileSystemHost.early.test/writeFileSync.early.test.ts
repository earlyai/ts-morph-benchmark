
// Unit tests for: writeFileSync

import { errors } from "../../errors";

import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      writeFileSync: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    isNotExistsError: jest.fn(),
    getStandardizedAbsolutePath: jest.fn(),
  },
}));

describe('RealFileSystemHost.writeFileSync() writeFileSync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should write file successfully with valid file path and content', () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      const fileText = 'Hello, World!';
      const writeFileSyncMock = runtime.fs.writeFileSync as jest.Mock;

      // Act
      fileSystemHost.writeFileSync(filePath, fileText);

      // Assert
      expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, fileText);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if writeFileSync throws an error', () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      const fileText = 'Hello, World!';
      const error = new Error('Write error');
      const writeFileSyncMock = runtime.fs.writeFileSync as jest.Mock;
      writeFileSyncMock.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => fileSystemHost.writeFileSync(filePath, fileText)).toThrow(error);
    });

    it.skip('should handle file not found error correctly', () => {
      // Arrange
      const filePath = 'path/to/nonexistent/file.txt';
      const fileText = 'Hello, World!';
      const error = new Error('File not found');
      const writeFileSyncMock = runtime.fs.writeFileSync as jest.Mock;
      const isNotExistsErrorMock = FileUtils.isNotExistsError as jest.Mock;
      const getStandardizedAbsolutePathMock = FileUtils.getStandardizedAbsolutePath as jest.Mock;

      writeFileSyncMock.mockImplementation(() => {
        throw error;
      });
      isNotExistsErrorMock.mockReturnValue(true);
      getStandardizedAbsolutePathMock.mockReturnValue(filePath);

      // Act & Assert
      expect(() => fileSystemHost.writeFileSync(filePath, fileText)).toThrow(errors.FileNotFoundError);
    });

    it('should handle other errors correctly', () => {
      // Arrange
      const filePath = 'path/to/file.txt';
      const fileText = 'Hello, World!';
      const error = new Error('Some other error');
      const writeFileSyncMock = runtime.fs.writeFileSync as jest.Mock;
      const isNotExistsErrorMock = FileUtils.isNotExistsError as jest.Mock;

      writeFileSyncMock.mockImplementation(() => {
        throw error;
      });
      isNotExistsErrorMock.mockReturnValue(false);

      // Act & Assert
      expect(() => fileSystemHost.writeFileSync(filePath, fileText)).toThrow(error);
    });
  });
});

// End of unit tests for: writeFileSync
