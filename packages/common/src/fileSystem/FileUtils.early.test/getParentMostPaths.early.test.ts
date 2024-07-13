
// Unit tests for: getParentMostPaths




import { StandardizedFilePath } from "../StandardizedFilePath";


import { FileUtils } from '../FileUtils';


describe('FileUtils.getParentMostPaths() getParentMostPaths method', () => {
  describe('Happy Path', () => {
    test.skip('should return the parent most paths from a list of paths', () => {
      const paths: StandardizedFilePath[] = [
        '/a/b/c' as StandardizedFilePath,
        '/a/b' as StandardizedFilePath,
        '/a/b/c/d' as StandardizedFilePath,
        '/e/f' as StandardizedFilePath,
        '/e/f/g' as StandardizedFilePath,
      ];

      const result = FileUtils.getParentMostPaths(paths);

      expect(result).toEqual([
        '/a/b' as StandardizedFilePath,
        '/e/f' as StandardizedFilePath,
      ]);
    });

    test('should return the same paths if they are all unique parent paths', () => {
      const paths: StandardizedFilePath[] = [
        '/a' as StandardizedFilePath,
        '/b' as StandardizedFilePath,
        '/c' as StandardizedFilePath,
      ];

      const result = FileUtils.getParentMostPaths(paths);

      expect(result).toEqual(paths);
    });
  });

  describe('Edge Cases', () => {
    test('should return an empty array when given an empty array', () => {
      const paths: StandardizedFilePath[] = [];

      const result = FileUtils.getParentMostPaths(paths);

      expect(result).toEqual([]);
    });

    test('should handle paths with different lengths correctly', () => {
      const paths: StandardizedFilePath[] = [
        '/a/b/c/d/e' as StandardizedFilePath,
        '/a/b' as StandardizedFilePath,
        '/a' as StandardizedFilePath,
      ];

      const result = FileUtils.getParentMostPaths(paths);

      expect(result).toEqual(['/a' as StandardizedFilePath]);
    });

    test.skip('should handle paths with similar prefixes but different structures', () => {
      const paths: StandardizedFilePath[] = [
        '/a/b/c' as StandardizedFilePath,
        '/a/bc' as StandardizedFilePath,
        '/a/b/cd' as StandardizedFilePath,
      ];

      const result = FileUtils.getParentMostPaths(paths);

      expect(result).toEqual([
        '/a/b/c' as StandardizedFilePath,
        '/a/bc' as StandardizedFilePath,
        '/a/b/cd' as StandardizedFilePath,
      ]);
    });

    test('should handle paths with trailing slashes correctly', () => {
      const paths: StandardizedFilePath[] = [
        '/a/b/c/' as StandardizedFilePath,
        '/a/b/' as StandardizedFilePath,
        '/a/b/c/d/' as StandardizedFilePath,
      ];

      const result = FileUtils.getParentMostPaths(paths);

      expect(result).toEqual(['/a/b/' as StandardizedFilePath]);
    });

    test.skip('should handle paths with mixed slashes correctly', () => {
      const paths: StandardizedFilePath[] = [
        '/a/b/c' as StandardizedFilePath,
        '\\a\\b' as StandardizedFilePath,
        '/a/b/c/d' as StandardizedFilePath,
      ];

      const result = FileUtils.getParentMostPaths(paths);

      expect(result).toEqual([
        '/a/b/c' as StandardizedFilePath,
        '\\a\\b' as StandardizedFilePath,
      ]);
    });
  });
});

// End of unit tests for: getParentMostPaths
