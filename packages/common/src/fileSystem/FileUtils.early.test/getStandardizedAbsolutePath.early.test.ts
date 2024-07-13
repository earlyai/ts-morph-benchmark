
// Unit tests for: getStandardizedAbsolutePath

import { runtime } from "../../runtimes";


import { FileSystemHost } from "../FileSystemHost";



import { FileUtils } from '../FileUtils';


jest.mock("../../runtimes", () => ({
  runtime: {
    path: {
      normalize: jest.fn(),
      join: jest.fn(),
    },
  },
}));

describe('FileUtils.getStandardizedAbsolutePath() getStandardizedAbsolutePath method', () => {
  let mockFileSystem: FileSystemHost;

  beforeEach(() => {
    mockFileSystem = {
      isCaseSensitive: jest.fn(),
      delete: jest.fn(),
      deleteSync: jest.fn(),
      readDirSync: jest.fn(),
      readFile: jest.fn(),
      readFileSync: jest.fn(),
      writeFile: jest.fn(),
      writeFileSync: jest.fn(),
      mkdir: jest.fn(),
      mkdirSync: jest.fn(),
      move: jest.fn(),
      moveSync: jest.fn(),
      copy: jest.fn(),
      copySync: jest.fn(),
      fileExists: jest.fn(),
      fileExistsSync: jest.fn(),
      directoryExists: jest.fn(),
      directoryExistsSync: jest.fn(),
      realpathSync: jest.fn(),
      getCurrentDirectory: jest.fn(),
      glob: jest.fn(),
      globSync: jest.fn(),
    };
  });

  describe('Happy Path', () => {
    test('should return the absolute path when the input path is already absolute', () => {
      const absolutePath = '/absolute/path/to/file';
      (runtime.path.normalize as jest.Mock).mockReturnValue(absolutePath);
      (runtime.path.join as jest.Mock).mockReturnValue(absolutePath);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, absolutePath);

      expect(result).toBe(absolutePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(absolutePath);
    });

    test('should return the absolute path when the input path is relative and relativeBase is provided', () => {
      const relativePath = 'relative/path/to/file';
      const relativeBase = '/base/path';
      const expectedPath = '/base/path/relative/path/to/file';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, relativePath, relativeBase);

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(relativeBase, relativePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });

    test('should return the absolute path when the input path is relative and relativeBase is not provided', () => {
      const relativePath = 'relative/path/to/file';
      const currentDir = '/current/dir';
      const expectedPath = '/current/dir/relative/path/to/file';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);
      (mockFileSystem.getCurrentDirectory as jest.Mock).mockReturnValue(currentDir);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, relativePath);

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(currentDir, relativePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('Edge Cases', () => {
    test('should handle paths with mixed slashes correctly', () => {
      const mixedPath = 'relative\\path/to\\file';
      const currentDir = '/current/dir';
      const expectedPath = '/current/dir/relative/path/to/file';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);
      (mockFileSystem.getCurrentDirectory as jest.Mock).mockReturnValue(currentDir);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, mixedPath);

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(currentDir, mixedPath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });

    test('should handle paths with leading "./" correctly', () => {
      const relativePath = './relative/path/to/file';
      const currentDir = '/current/dir';
      const expectedPath = '/current/dir/relative/path/to/file';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);
      (mockFileSystem.getCurrentDirectory as jest.Mock).mockReturnValue(currentDir);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, relativePath);

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(currentDir, relativePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });

    test('should handle empty relativeBase correctly', () => {
      const relativePath = 'relative/path/to/file';
      const currentDir = '/current/dir';
      const expectedPath = '/current/dir/relative/path/to/file';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);
      (mockFileSystem.getCurrentDirectory as jest.Mock).mockReturnValue(currentDir);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, relativePath, '');

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(currentDir, relativePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });

    test('should handle paths with only "./" correctly', () => {
      const relativePath = './';
      const currentDir = '/current/dir';
      const expectedPath = '/current/dir';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);
      (mockFileSystem.getCurrentDirectory as jest.Mock).mockReturnValue(currentDir);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, relativePath);

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(currentDir, relativePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });

    test('should handle paths with only "." correctly', () => {
      const relativePath = '.';
      const currentDir = '/current/dir';
      const expectedPath = '/current/dir';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);
      (mockFileSystem.getCurrentDirectory as jest.Mock).mockReturnValue(currentDir);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, relativePath);

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(currentDir, relativePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });

    test('should handle paths with trailing slashes correctly', () => {
      const relativePath = 'relative/path/to/file/';
      const currentDir = '/current/dir';
      const expectedPath = '/current/dir/relative/path/to/file';
      (runtime.path.normalize as jest.Mock).mockReturnValue(expectedPath);
      (runtime.path.join as jest.Mock).mockReturnValue(expectedPath);
      (mockFileSystem.getCurrentDirectory as jest.Mock).mockReturnValue(currentDir);

      const result = FileUtils.getStandardizedAbsolutePath(mockFileSystem, relativePath);

      expect(result).toBe(expectedPath);
      expect(runtime.path.join).toHaveBeenCalledWith(currentDir, relativePath);
      expect(runtime.path.normalize).toHaveBeenCalledWith(expectedPath);
    });
  });
});

// End of unit tests for: getStandardizedAbsolutePath
