
// Unit tests for: readDirectory


import { getFileMatcherPatterns, matchFiles } from "../../typescript";

import { readDirectory } from '../readDirectory';


jest.mock("../../typescript", () => {
  const actual = jest.requireActual("../../typescript");
  return {
    ...actual,
    getFileMatcherPatterns: jest.fn(),
    matchFiles: jest.fn(),
  };
});

class MockTransactionalFileSystem {
  public getCurrentDirectory = jest.fn();
  public getStandardizedAbsolutePath = jest.fn();
  public realpathSync = jest.fn();
  public directoryExistsSync = jest.fn();
  public readDirSync = jest.fn();
}

describe('readDirectory() readDirectory method', () => {
  let mockFileSystem: MockTransactionalFileSystem;

  beforeEach(() => {
    mockFileSystem = new MockTransactionalFileSystem();
  });

  describe('Happy Path', () => {
    it.skip('should return matched files and directories', () => {
      // Arrange
      const rootDir = '/root';
      const extensions = ['.ts'];
      const excludes = ['node_modules'];
      const includes = ['src'];
      const depth = 2;
      const currentDir = '/current';
      const standardizedPath = '/root/src';

      mockFileSystem.getCurrentDirectory.mockReturnValue(currentDir);
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedPath);
      mockFileSystem.readDirSync.mockReturnValue([
        { path: '/root/src/file1.ts', isFile: true },
        { path: '/root/src/dir1', isDirectory: true },
      ] as any);

      (getFileMatcherPatterns as any).mockReturnValue({
        includeDirectoryPattern: 'src',
        excludePattern: 'node_modules',
      });

      (matchFiles as any).mockReturnValue({
        files: ['/root/src/file1.ts'],
        directories: ['/root/src/dir1'],
      });

      // Act
      const result = readDirectory(
        mockFileSystem as any,
        true,
        rootDir,
        extensions,
        excludes,
        includes,
        depth
      );

      // Assert
      expect(result).toEqual({
        files: ['/root/src/file1.ts'],
        directories: ['/root/src/dir1'],
      });
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle empty includes and excludes', () => {
      // Arrange
      const rootDir = '/root';
      const extensions = ['.ts'];
      const includes: string[] = [];
      const excludes: string[] = [];
      const currentDir = '/current';
      const standardizedPath = '/root';

      mockFileSystem.getCurrentDirectory.mockReturnValue(currentDir);
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedPath);
      mockFileSystem.readDirSync.mockReturnValue([
        { path: '/root/file1.ts', isFile: true },
        { path: '/root/dir1', isDirectory: true },
      ] as any);

      (getFileMatcherPatterns as any).mockReturnValue({
        includeDirectoryPattern: '',
        excludePattern: '',
      });

      (matchFiles as any).mockReturnValue({
        files: ['/root/file1.ts'],
        directories: ['/root/dir1'],
      });

      // Act
      const result = readDirectory(
        mockFileSystem as any,
        true,
        rootDir,
        extensions,
        excludes,
        includes
      );

      // Assert
      expect(result).toEqual({
        files: ['/root/file1.ts'],
        directories: ['/root/dir1'],
      });
    });

    it.skip('should handle non-existent directories gracefully', () => {
      // Arrange
      const rootDir = '/nonexistent';
      const extensions = ['.ts'];
      const includes = ['src'];
      const excludes: string[] = [];
      const currentDir = '/current';
      const standardizedPath = '/nonexistent/src';

      mockFileSystem.getCurrentDirectory.mockReturnValue(currentDir);
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedPath);
      mockFileSystem.readDirSync.mockImplementation(() => {
        throw new Error('Directory does not exist');
      });

      (getFileMatcherPatterns as any).mockReturnValue({
        includeDirectoryPattern: 'src',
        excludePattern: '',
      });

      (matchFiles as any).mockReturnValue({
        files: [],
        directories: [],
      });

      // Act
      const result = readDirectory(
        mockFileSystem as any,
        true,
        rootDir,
        extensions,
        excludes,
        includes
      );

      // Assert
      expect(result).toEqual({
        files: [],
        directories: [],
      });
    });

    it.skip('should handle case insensitive file names', () => {
      // Arrange
      const rootDir = '/root';
      const extensions = ['.ts'];
      const includes = ['src'];
      const excludes: string[] = [];
      const currentDir = '/current';
      const standardizedPath = '/root/src';

      mockFileSystem.getCurrentDirectory.mockReturnValue(currentDir);
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue(standardizedPath);
      mockFileSystem.readDirSync.mockReturnValue([
        { path: '/root/src/file1.ts', isFile: true },
        { path: '/root/src/dir1', isDirectory: true },
      ] as any);

      (getFileMatcherPatterns as any).mockReturnValue({
        includeDirectoryPattern: 'src',
        excludePattern: '',
      });

      (matchFiles as any).mockReturnValue({
        files: ['/root/src/file1.ts'],
        directories: ['/root/src/dir1'],
      });

      // Act
      const result = readDirectory(
        mockFileSystem as any,
        false,
        rootDir,
        extensions,
        excludes,
        includes
      );

      // Assert
      expect(result).toEqual({
        files: ['/root/src/file1.ts'],
        directories: ['/root/src/dir1'],
      });
    });
  });
});

// End of unit tests for: readDirectory
