
// Unit tests for: getCurrentDirectory


import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      getCurrentDirectory: jest.fn()
    }
  }
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    standardizeSlashes: jest.fn()
  }
}));

describe('RealFileSystemHost.getCurrentDirectory() getCurrentDirectory method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should return the standardized current directory', () => {
      // Arrange
      const mockCurrentDirectory = '/mock/current/directory';
      (runtime.fs.getCurrentDirectory as jest.Mock).mockReturnValue(mockCurrentDirectory);
      (FileUtils.standardizeSlashes as jest.Mock).mockReturnValue(mockCurrentDirectory);

      // Act
      const result = fileSystemHost.getCurrentDirectory();

      // Assert
      expect(runtime.fs.getCurrentDirectory).toHaveBeenCalled();
      expect(FileUtils.standardizeSlashes).toHaveBeenCalledWith(mockCurrentDirectory);
      expect(result).toBe(mockCurrentDirectory);
    });
  });

  describe('Edge Cases', () => {
    it('should handle an empty string returned from fs.getCurrentDirectory', () => {
      // Arrange
      const mockCurrentDirectory = '';
      const standardizedDirectory = '/';
      (runtime.fs.getCurrentDirectory as jest.Mock).mockReturnValue(mockCurrentDirectory);
      (FileUtils.standardizeSlashes as jest.Mock).mockReturnValue(standardizedDirectory);

      // Act
      const result = fileSystemHost.getCurrentDirectory();

      // Assert
      expect(runtime.fs.getCurrentDirectory).toHaveBeenCalled();
      expect(FileUtils.standardizeSlashes).toHaveBeenCalledWith(mockCurrentDirectory);
      expect(result).toBe(standardizedDirectory);
    });

    it('should handle a null value returned from fs.getCurrentDirectory', () => {
      // Arrange
      const mockCurrentDirectory = null;
      const standardizedDirectory = '/';
      (runtime.fs.getCurrentDirectory as jest.Mock).mockReturnValue(mockCurrentDirectory);
      (FileUtils.standardizeSlashes as jest.Mock).mockReturnValue(standardizedDirectory);

      // Act
      const result = fileSystemHost.getCurrentDirectory();

      // Assert
      expect(runtime.fs.getCurrentDirectory).toHaveBeenCalled();
      expect(FileUtils.standardizeSlashes).toHaveBeenCalledWith(mockCurrentDirectory);
      expect(result).toBe(standardizedDirectory);
    });

    it('should handle a directory path with mixed slashes', () => {
      // Arrange
      const mockCurrentDirectory = 'C:\\mock\\current/directory';
      const standardizedDirectory = 'C:/mock/current/directory';
      (runtime.fs.getCurrentDirectory as jest.Mock).mockReturnValue(mockCurrentDirectory);
      (FileUtils.standardizeSlashes as jest.Mock).mockReturnValue(standardizedDirectory);

      // Act
      const result = fileSystemHost.getCurrentDirectory();

      // Assert
      expect(runtime.fs.getCurrentDirectory).toHaveBeenCalled();
      expect(FileUtils.standardizeSlashes).toHaveBeenCalledWith(mockCurrentDirectory);
      expect(result).toBe(standardizedDirectory);
    });
  });
});

// End of unit tests for: getCurrentDirectory
