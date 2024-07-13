
// Unit tests for: glob





import { matchGlobs } from "../matchGlobs";


import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


// Mocking matchGlobs function
jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

// Mocking FileUtils functions
jest.mock("../FileUtils", () => {
  const actual = jest.requireActual("../FileUtils");
  return {
    ...actual,
    getStandardizedAbsolutePath: jest.fn(),
    getDirPath: jest.fn(),
    pathJoin: jest.fn(),
    getBaseName: jest.fn(),
    getRelativePathTo: jest.fn(),
    pathStartsWith: jest.fn(),
  };
});

// Mock types
type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.glob() glob method', () => {
  let fileSystemHost: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    it.skip('should return matched file paths for given patterns', () => {
      // Arrange
      const patterns = ['*.ts'];
      const mockFilePaths = ['/file1.ts', '/file2.ts'];
      const mockDirectories: MockVirtualDirectory[] = [
        { path: '/' as MockStandardizedFilePath, files: new Map([['/file1.ts' as MockStandardizedFilePath, 'content1'], ['/file2.ts' as MockStandardizedFilePath, 'content2']]) },
      ];

      jest.spyOn(fileSystemHost as any, '#directories', 'get').mockReturnValue(new Map(mockDirectories.map(dir => [dir.path, dir])) as any);
      (matchGlobs as jest.Mock).mockReturnValue(mockFilePaths);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual(mockFilePaths);
      expect(matchGlobs).toHaveBeenCalledWith(mockFilePaths, patterns, '/');
    });
  });

  describe('Edge Cases', () => {
    it.skip('should return an empty array when no files match the patterns', () => {
      // Arrange
      const patterns = ['*.js'];
      const mockFilePaths: string[] = [];
      const mockDirectories: MockVirtualDirectory[] = [
        { path: '/' as MockStandardizedFilePath, files: new Map([['/file1.ts' as MockStandardizedFilePath, 'content1'], ['/file2.ts' as MockStandardizedFilePath, 'content2']]) },
      ];

      jest.spyOn(fileSystemHost as any, '#directories', 'get').mockReturnValue(new Map(mockDirectories.map(dir => [dir.path, dir])) as any);
      (matchGlobs as jest.Mock).mockReturnValue(mockFilePaths);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith(['/file1.ts', '/file2.ts'], patterns, '/');
    });

    it.skip('should handle patterns that match no files gracefully', () => {
      // Arrange
      const patterns = ['*.md'];
      const mockFilePaths: string[] = [];
      const mockDirectories: MockVirtualDirectory[] = [
        { path: '/' as MockStandardizedFilePath, files: new Map([['/file1.ts' as MockStandardizedFilePath, 'content1'], ['/file2.ts' as MockStandardizedFilePath, 'content2']]) },
      ];

      jest.spyOn(fileSystemHost as any, '#directories', 'get').mockReturnValue(new Map(mockDirectories.map(dir => [dir.path, dir])) as any);
      (matchGlobs as jest.Mock).mockReturnValue(mockFilePaths);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith(['/file1.ts', '/file2.ts'], patterns, '/');
    });

    it.skip('should handle empty patterns array gracefully', () => {
      // Arrange
      const patterns: string[] = [];
      const mockFilePaths: string[] = [];
      const mockDirectories: MockVirtualDirectory[] = [
        { path: '/' as MockStandardizedFilePath, files: new Map([['/file1.ts' as MockStandardizedFilePath, 'content1'], ['/file2.ts' as MockStandardizedFilePath, 'content2']]) },
      ];

      jest.spyOn(fileSystemHost as any, '#directories', 'get').mockReturnValue(new Map(mockDirectories.map(dir => [dir.path, dir])) as any);
      (matchGlobs as jest.Mock).mockReturnValue(mockFilePaths);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith(['/file1.ts', '/file2.ts'], patterns, '/');
    });

    it.skip('should handle non-existent directories gracefully', () => {
      // Arrange
      const patterns = ['*.ts'];
      const mockFilePaths: string[] = [];
      const mockDirectories: MockVirtualDirectory[] = [];

      jest.spyOn(fileSystemHost as any, '#directories', 'get').mockReturnValue(new Map(mockDirectories.map(dir => [dir.path, dir])) as any);
      (matchGlobs as jest.Mock).mockReturnValue(mockFilePaths);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith([], patterns, '/');
    });
  });
});

// End of unit tests for: glob
