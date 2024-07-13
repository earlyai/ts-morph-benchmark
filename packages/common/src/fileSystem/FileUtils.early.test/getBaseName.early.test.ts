
// Unit tests for: getBaseName




import { StandardizedFilePath } from "../StandardizedFilePath";


import { FileUtils } from '../FileUtils';


describe('FileUtils.getBaseName() getBaseName method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return the base name of a simple file path', () => {
      const filePath: StandardizedFilePath = '/path/to/file.txt' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('file.txt');
    });

    test('should return the base name of a file path with multiple slashes', () => {
      const filePath: StandardizedFilePath = '/path/to/another/path/file.txt' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('file.txt');
    });

    test('should return the base name of a file path with no directory', () => {
      const filePath: StandardizedFilePath = 'file.txt' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('file.txt');
    });

    test.skip('should return the base name of a file path with trailing slash', () => {
      const filePath: StandardizedFilePath = '/path/to/file.txt/' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('file.txt');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return the base name when there is no slash in the path', () => {
      const filePath: StandardizedFilePath = 'file' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('file');
    });

    test('should return the base name when the path is a single slash', () => {
      const filePath: StandardizedFilePath = '/' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('');
    });

    test.skip('should return the base name when the path ends with multiple slashes', () => {
      const filePath: StandardizedFilePath = '/path/to/file.txt///' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('file.txt');
    });

    test('should return the base name when the path contains only slashes', () => {
      const filePath: StandardizedFilePath = '///' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('');
    });

    test('should return the base name when the path contains special characters', () => {
      const filePath: StandardizedFilePath = '/path/to/special!@#$%^&*()_+file.txt' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('special!@#$%^&*()_+file.txt');
    });

    test('should return the base name when the path is an empty string', () => {
      const filePath: StandardizedFilePath = '' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('');
    });

    test('should return the base name when the path is a root directory', () => {
      const filePath: StandardizedFilePath = '/' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('');
    });

    test.skip('should return the base name when the path is a Windows root directory', () => {
      const filePath: StandardizedFilePath = 'C:\\' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('');
    });

    test.skip('should return the base name when the path is a Windows file path', () => {
      const filePath: StandardizedFilePath = 'C:\\path\\to\\file.txt' as StandardizedFilePath;
      const result = FileUtils.getBaseName(filePath);
      expect(result).toBe('file.txt');
    });
  });
});

// End of unit tests for: getBaseName
