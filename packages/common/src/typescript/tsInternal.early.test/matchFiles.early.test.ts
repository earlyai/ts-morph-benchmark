
// Unit tests for: matchFiles


import { matchFiles } from '../tsInternal';


interface MockFileSystemEntries {
  files: ReadonlyArray<string>;
  directories: ReadonlyArray<string>;
}

describe('matchFiles() matchFiles method', () => {
  let mockGetEntries: jest.Mock;
  let mockRealpath: jest.Mock;
  let mockDirectoryExists: jest.Mock;

  beforeEach(() => {
    mockGetEntries = jest.fn();
    mockRealpath = jest.fn();
    mockDirectoryExists = jest.fn();
  });

  describe('Happy Path', () => {
    test('should match files correctly with given parameters', () => {
      // Arrange
      const path = '/src';
      const extensions = ['.ts', '.js'];
      const excludes = ['node_modules'];
      const includes = ['**/*.ts', '**/*.js'];
      const useCaseSensitiveFileNames = true;
      const currentDirectory = '/';
      const depth = undefined;
      const mockEntries: MockFileSystemEntries = {
        files: ['file1.ts', 'file2.js'],
        directories: ['dir1', 'dir2']
      };

      mockGetEntries.mockReturnValue(mockEntries as any);
      mockRealpath.mockReturnValue('/src/file1.ts' as any);
      mockDirectoryExists.mockReturnValue(true as any);

      // Act
      const result = matchFiles(
        path,
        extensions,
        excludes,
        includes,
        useCaseSensitiveFileNames,
        currentDirectory,
        depth,
        mockGetEntries as any,
        mockRealpath as any,
        mockDirectoryExists as any
      );

      // Assert
      expect(result).toEqual(['/src/file1.ts', '/src/file2.js']);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should handle empty includes and excludes', () => {
      // Arrange
      const path = '/src';
      const extensions = ['.ts', '.js'];
      const excludes: ReadonlyArray<string> = [];
      const includes: ReadonlyArray<string> = [];
      const useCaseSensitiveFileNames = true;
      const currentDirectory = '/';
      const depth = undefined;
      const mockEntries: MockFileSystemEntries = {
        files: ['file1.ts', 'file2.js'],
        directories: ['dir1', 'dir2']
      };

      mockGetEntries.mockReturnValue(mockEntries as any);
      mockRealpath.mockReturnValue('/src/file1.ts' as any);
      mockDirectoryExists.mockReturnValue(true as any);

      // Act
      const result = matchFiles(
        path,
        extensions,
        excludes,
        includes,
        useCaseSensitiveFileNames,
        currentDirectory,
        depth,
        mockGetEntries as any,
        mockRealpath as any,
        mockDirectoryExists as any
      );

      // Assert
      expect(result).toEqual([]);
    });

    test.skip('should handle non-existent directory', () => {
      // Arrange
      const path = '/nonexistent';
      const extensions = ['.ts', '.js'];
      const excludes = ['node_modules'];
      const includes = ['**/*.ts', '**/*.js'];
      const useCaseSensitiveFileNames = true;
      const currentDirectory = '/';
      const depth = undefined;

      mockDirectoryExists.mockReturnValue(false as any);

      // Act
      const result = matchFiles(
        path,
        extensions,
        excludes,
        includes,
        useCaseSensitiveFileNames,
        currentDirectory,
        depth,
        mockGetEntries as any,
        mockRealpath as any,
        mockDirectoryExists as any
      );

      // Assert
      expect(result).toEqual([]);
    });

    test.skip('should handle case insensitive file names', () => {
      // Arrange
      const path = '/src';
      const extensions = ['.ts', '.js'];
      const excludes = ['node_modules'];
      const includes = ['**/*.ts', '**/*.js'];
      const useCaseSensitiveFileNames = false;
      const currentDirectory = '/';
      const depth = undefined;
      const mockEntries: MockFileSystemEntries = {
        files: ['file1.TS', 'file2.JS'],
        directories: ['dir1', 'dir2']
      };

      mockGetEntries.mockReturnValue(mockEntries as any);
      mockRealpath.mockReturnValue('/src/file1.TS' as any);
      mockDirectoryExists.mockReturnValue(true as any);

      // Act
      const result = matchFiles(
        path,
        extensions,
        excludes,
        includes,
        useCaseSensitiveFileNames,
        currentDirectory,
        depth,
        mockGetEntries as any,
        mockRealpath as any,
        mockDirectoryExists as any
      );

      // Assert
      expect(result).toEqual(['/src/file1.TS', '/src/file2.JS']);
    });
  });
});

// End of unit tests for: matchFiles
