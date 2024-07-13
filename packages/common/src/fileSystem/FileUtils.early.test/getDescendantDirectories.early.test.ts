
// Unit tests for: getDescendantDirectories




import { StandardizedFilePath } from "../StandardizedFilePath";


import { FileUtils } from '../FileUtils';


class MockTransactionalFileSystem {
  public readDirSync = jest.fn();
}

describe('FileUtils.getDescendantDirectories() getDescendantDirectories method', () => {
  let mockFileSystem: MockTransactionalFileSystem;

  beforeEach(() => {
    mockFileSystem = new MockTransactionalFileSystem();
  });

  describe('Happy Path', () => {
    test('should yield descendant directories correctly', () => {
      // Arrange
      const dirPath: StandardizedFilePath = '/root' as any;
      const subDir1: StandardizedFilePath = '/root/subdir1' as any;
      const subDir2: StandardizedFilePath = '/root/subdir2' as any;
      const subSubDir1: StandardizedFilePath = '/root/subdir1/subsubdir1' as any;

      mockFileSystem.readDirSync.mockImplementation((path: StandardizedFilePath) => {
        if (path === dirPath) {
          return [
            { path: subDir1, isDirectory: true },
            { path: subDir2, isDirectory: true },
            { path: '/root/file1.txt', isDirectory: false }
          ] as any;
        } else if (path === subDir1) {
          return [
            { path: subSubDir1, isDirectory: true },
            { path: '/root/subdir1/file2.txt', isDirectory: false }
          ] as any;
        } else if (path === subDir2) {
          return [] as any;
        } else if (path === subSubDir1) {
          return [] as any;
        }
        return [] as any;
      });

      // Act
      const result = Array.from(FileUtils.getDescendantDirectories(mockFileSystem as any, dirPath));

      // Assert
      expect(result).toEqual([subDir1, subSubDir1, subDir2]);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty directory', () => {
      // Arrange
      const dirPath: StandardizedFilePath = '/empty' as any;
      mockFileSystem.readDirSync.mockReturnValue([] as any);

      // Act
      const result = Array.from(FileUtils.getDescendantDirectories(mockFileSystem as any, dirPath));

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle directory with only files', () => {
      // Arrange
      const dirPath: StandardizedFilePath = '/onlyfiles' as any;
      mockFileSystem.readDirSync.mockReturnValue([
        { path: '/onlyfiles/file1.txt', isDirectory: false },
        { path: '/onlyfiles/file2.txt', isDirectory: false }
      ] as any);

      // Act
      const result = Array.from(FileUtils.getDescendantDirectories(mockFileSystem as any, dirPath));

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle nested directories with no files', () => {
      // Arrange
      const dirPath: StandardizedFilePath = '/nested' as any;
      const subDir1: StandardizedFilePath = '/nested/subdir1' as any;
      const subDir2: StandardizedFilePath = '/nested/subdir2' as any;
      const subSubDir1: StandardizedFilePath = '/nested/subdir1/subsubdir1' as any;

      mockFileSystem.readDirSync.mockImplementation((path: StandardizedFilePath) => {
        if (path === dirPath) {
          return [
            { path: subDir1, isDirectory: true },
            { path: subDir2, isDirectory: true }
          ] as any;
        } else if (path === subDir1) {
          return [
            { path: subSubDir1, isDirectory: true }
          ] as any;
        } else if (path === subDir2) {
          return [] as any;
        } else if (path === subSubDir1) {
          return [] as any;
        }
        return [] as any;
      });

      // Act
      const result = Array.from(FileUtils.getDescendantDirectories(mockFileSystem as any, dirPath));

      // Assert
      expect(result).toEqual([subDir1, subSubDir1, subDir2]);
    });

    test('should handle directory with mixed files and directories', () => {
      // Arrange
      const dirPath: StandardizedFilePath = '/mixed' as any;
      const subDir1: StandardizedFilePath = '/mixed/subdir1' as any;
      const subDir2: StandardizedFilePath = '/mixed/subdir2' as any;

      mockFileSystem.readDirSync.mockImplementation((path: StandardizedFilePath) => {
        if (path === dirPath) {
          return [
            { path: subDir1, isDirectory: true },
            { path: '/mixed/file1.txt', isDirectory: false },
            { path: subDir2, isDirectory: true }
          ] as any;
        } else if (path === subDir1) {
          return [
            { path: '/mixed/subdir1/file2.txt', isDirectory: false }
          ] as any;
        } else if (path === subDir2) {
          return [] as any;
        }
        return [] as any;
      });

      // Act
      const result = Array.from(FileUtils.getDescendantDirectories(mockFileSystem as any, dirPath));

      // Assert
      expect(result).toEqual([subDir1, subDir2]);
    });

    test('should handle deeply nested directories', () => {
      // Arrange
      const dirPath: StandardizedFilePath = '/deep' as any;
      const subDir1: StandardizedFilePath = '/deep/subdir1' as any;
      const subSubDir1: StandardizedFilePath = '/deep/subdir1/subsubdir1' as any;
      const subSubSubDir1: StandardizedFilePath = '/deep/subdir1/subsubdir1/subsubsubdir1' as any;

      mockFileSystem.readDirSync.mockImplementation((path: StandardizedFilePath) => {
        if (path === dirPath) {
          return [
            { path: subDir1, isDirectory: true }
          ] as any;
        } else if (path === subDir1) {
          return [
            { path: subSubDir1, isDirectory: true }
          ] as any;
        } else if (path === subSubDir1) {
          return [
            { path: subSubSubDir1, isDirectory: true }
          ] as any;
        } else if (path === subSubSubDir1) {
          return [] as any;
        }
        return [] as any;
      });

      // Act
      const result = Array.from(FileUtils.getDescendantDirectories(mockFileSystem as any, dirPath));

      // Assert
      expect(result).toEqual([subDir1, subSubDir1, subSubSubDir1]);
    });
  });
});

// End of unit tests for: getDescendantDirectories
