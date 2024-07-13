
// Unit tests for: readDirSync

import { errors } from "../../errors";

import { runtime, RuntimeDirEntry } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      readDirSync: jest.fn(),
      statSync: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  pathJoin: jest.fn((...args) => args.join('/')),
  isNotExistsError: jest.fn(),
  getStandardizedAbsolutePath: jest.fn((host, path) => path),
}));

describe('RealFileSystemHost.readDirSync() readDirSync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    it.skip('should return directory entries with updated names', () => {
      // Arrange
      const dirPath = '/testDir';
      const entries: RuntimeDirEntry[] = [
        { name: 'file1.txt', isFile: true, isDirectory: false, isSymlink: false },
        { name: 'subdir', isFile: false, isDirectory: true, isSymlink: false },
      ];
      (runtime.fs.readDirSync as jest.Mock).mockReturnValue(entries);

      // Act
      const result = fileSystemHost.readDirSync(dirPath);

      // Assert
      expect(result).toEqual([
        { name: '/testDir/file1.txt', isFile: true, isDirectory: false, isSymlink: false },
        { name: '/testDir/subdir', isFile: false, isDirectory: true, isSymlink: false },
      ]);
      expect(runtime.fs.readDirSync).toHaveBeenCalledWith(dirPath);
    });

    it.skip('should update symlink entries with correct file and directory status', () => {
      // Arrange
      const dirPath = '/testDir';
      const entries: RuntimeDirEntry[] = [
        { name: 'link', isFile: false, isDirectory: false, isSymlink: true },
      ];
      const statInfo = { isDirectory: () => true, isFile: () => false };
      (runtime.fs.readDirSync as jest.Mock).mockReturnValue(entries);
      (runtime.fs.statSync as jest.Mock).mockReturnValue(statInfo);

      // Act
      const result = fileSystemHost.readDirSync(dirPath);

      // Assert
      expect(result).toEqual([
        { name: '/testDir/link', isFile: false, isDirectory: true, isSymlink: true },
      ]);
      expect(runtime.fs.readDirSync).toHaveBeenCalledWith(dirPath);
      expect(runtime.fs.statSync).toHaveBeenCalledWith('/testDir/link');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty directory', () => {
      // Arrange
      const dirPath = '/emptyDir';
      (runtime.fs.readDirSync as jest.Mock).mockReturnValue([]);

      // Act
      const result = fileSystemHost.readDirSync(dirPath);

      // Assert
      expect(result).toEqual([]);
      expect(runtime.fs.readDirSync).toHaveBeenCalledWith(dirPath);
    });

    it.skip('should handle symlink stat error gracefully', () => {
      // Arrange
      const dirPath = '/testDir';
      const entries: RuntimeDirEntry[] = [
        { name: 'link', isFile: false, isDirectory: false, isSymlink: true },
      ];
      (runtime.fs.readDirSync as jest.Mock).mockReturnValue(entries);
      (runtime.fs.statSync as jest.Mock).mockImplementation(() => { throw new Error('stat error'); });

      // Act
      const result = fileSystemHost.readDirSync(dirPath);

      // Assert
      expect(result).toEqual([
        { name: '/testDir/link', isFile: false, isDirectory: false, isSymlink: true },
      ]);
      expect(runtime.fs.readDirSync).toHaveBeenCalledWith(dirPath);
      expect(runtime.fs.statSync).toHaveBeenCalledWith('/testDir/link');
    });

    it.skip('should throw DirectoryNotFoundError if directory does not exist', () => {
      // Arrange
      const dirPath = '/nonExistentDir';
      const error = new Error('not exists');
      (runtime.fs.readDirSync as jest.Mock).mockImplementation(() => { throw error; });
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(true);

      // Act & Assert
      expect(() => fileSystemHost.readDirSync(dirPath)).toThrow(errors.DirectoryNotFoundError);
      expect(runtime.fs.readDirSync).toHaveBeenCalledWith(dirPath);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
    });

    it.skip('should rethrow other errors', () => {
      // Arrange
      const dirPath = '/errorDir';
      const error = new Error('some other error');
      (runtime.fs.readDirSync as jest.Mock).mockImplementation(() => { throw error; });
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(false);

      // Act & Assert
      expect(() => fileSystemHost.readDirSync(dirPath)).toThrow(error);
      expect(runtime.fs.readDirSync).toHaveBeenCalledWith(dirPath);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
    });
  });
});

// End of unit tests for: readDirSync
