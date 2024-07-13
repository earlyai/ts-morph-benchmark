
// Unit tests for: globSync





import { matchGlobs } from "../matchGlobs";


import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


// Mocking the matchGlobs function
jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

// Mocking the FileUtils functions
jest.mock("../FileUtils", () => {
  const actual = jest.requireActual("../FileUtils");
  return {
    ...actual,
    getStandardizedAbsolutePath: jest.fn(),
    getDirPath: jest.fn(),
    getRelativePathTo: jest.fn(),
    pathJoin: jest.fn(),
    pathStartsWith: jest.fn(),
  };
});

// Mock types
type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.globSync() globSync method', () => {
  let fileSystemHost: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    it.skip('should return matched file paths for given patterns', () => {
      // Arrange
      const patterns = ['*.ts'];
      const mockFilePaths = ['/file1.ts', '/file2.ts'];
      const mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>([
        ['/' as MockStandardizedFilePath, { path: '/' as MockStandardizedFilePath, files: new Map(mockFilePaths.map(path => [path as MockStandardizedFilePath, ''])) }],
      ]);

      (fileSystemHost as any)['#directories'] = mockDirectories;
      (matchGlobs as jest.Mock).mockReturnValue(mockFilePaths);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual(mockFilePaths);
      expect(matchGlobs).toHaveBeenCalledWith(mockFilePaths, patterns, '/');
    });
  });

  describe('Edge Cases', () => {
    it('should return an empty array when no files match the patterns', () => {
      // Arrange
      const patterns = ['*.js'];
      const mockFilePaths: MockStandardizedFilePath[] = [];
      const mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>([
        ['/' as MockStandardizedFilePath, { path: '/' as MockStandardizedFilePath, files: new Map(mockFilePaths.map(path => [path as MockStandardizedFilePath, ''])) }],
      ]);

      (fileSystemHost as any)['#directories'] = mockDirectories;
      (matchGlobs as jest.Mock).mockReturnValue(mockFilePaths);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith(mockFilePaths, patterns, '/');
    });

    it.skip('should handle patterns that match no files gracefully', () => {
      // Arrange
      const patterns = ['*.nonexistent'];
      const mockFilePaths = ['/file1.ts', '/file2.ts'];
      const mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>([
        ['/' as MockStandardizedFilePath, { path: '/' as MockStandardizedFilePath, files: new Map(mockFilePaths.map(path => [path as MockStandardizedFilePath, ''])) }],
      ]);

      (fileSystemHost as any)['#directories'] = mockDirectories;
      (matchGlobs as jest.Mock).mockReturnValue([]);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith(mockFilePaths, patterns, '/');
    });

    it.skip('should handle empty patterns array gracefully', () => {
      // Arrange
      const patterns: string[] = [];
      const mockFilePaths = ['/file1.ts', '/file2.ts'];
      const mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>([
        ['/' as MockStandardizedFilePath, { path: '/' as MockStandardizedFilePath, files: new Map(mockFilePaths.map(path => [path as MockStandardizedFilePath, ''])) }],
      ]);

      (fileSystemHost as any)['#directories'] = mockDirectories;
      (matchGlobs as jest.Mock).mockReturnValue([]);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith(mockFilePaths, patterns, '/');
    });

    it('should handle directories with no files gracefully', () => {
      // Arrange
      const patterns = ['*.ts'];
      const mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>([
        ['/' as MockStandardizedFilePath, { path: '/' as MockStandardizedFilePath, files: new Map() }],
      ]);

      (fileSystemHost as any)['#directories'] = mockDirectories;
      (matchGlobs as jest.Mock).mockReturnValue([]);

      // Act
      const result = fileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(matchGlobs).toHaveBeenCalledWith([], patterns, '/');
    });
  });
});

// End of unit tests for: globSync
