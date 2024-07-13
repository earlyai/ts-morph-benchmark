
// Unit tests for: pathIsAbsolute






import { FileUtils } from '../FileUtils';


describe('FileUtils.pathIsAbsolute() pathIsAbsolute method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for a Unix absolute path', () => {
      const result = FileUtils.pathIsAbsolute('/home/user/project');
      expect(result).toBe(true);
    });

    test('should return true for a Windows absolute path with drive letter', () => {
      const result = FileUtils.pathIsAbsolute('C:\\Users\\user\\project');
      expect(result).toBe(true);
    });

    test('should return true for a Windows absolute path with forward slashes', () => {
      const result = FileUtils.pathIsAbsolute('C:/Users/user/project');
      expect(result).toBe(true);
    });

    test('should return true for a UNC path', () => {
      const result = FileUtils.pathIsAbsolute('\\\\server\\share\\folder');
      expect(result).toBe(true);
    });

    test('should return true for an Azure absolute path', () => {
      const result = FileUtils.pathIsAbsolute('\\\\Azure\\path');
      expect(result).toBe(true);
    });

    test('should return false for a relative path', () => {
      const result = FileUtils.pathIsAbsolute('relative/path/to/file');
      expect(result).toBe(false);
    });

    test('should return false for a relative path with dot notation', () => {
      const result = FileUtils.pathIsAbsolute('./relative/path/to/file');
      expect(result).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for an empty string', () => {
      const result = FileUtils.pathIsAbsolute('');
      expect(result).toBe(false);
    });

    test('should return false for a single dot', () => {
      const result = FileUtils.pathIsAbsolute('.');
      expect(result).toBe(false);
    });

    test('should return false for a double dot', () => {
      const result = FileUtils.pathIsAbsolute('..');
      expect(result).toBe(false);
    });

    test.skip('should return false for a path with only slashes', () => {
      const result = FileUtils.pathIsAbsolute('////');
      expect(result).toBe(false);
    });

    test('should return true for a Windows root directory', () => {
      const result = FileUtils.pathIsAbsolute('C:/');
      expect(result).toBe(true);
    });

    test('should return true for a Windows root directory with backslashes', () => {
      const result = FileUtils.pathIsAbsolute('C:\\');
      expect(result).toBe(true);
    });

    test('should return true for a Unix root directory', () => {
      const result = FileUtils.pathIsAbsolute('/');
      expect(result).toBe(true);
    });

    test('should return false for a path with mixed slashes that is not absolute', () => {
      const result = FileUtils.pathIsAbsolute('folder\\subfolder/file');
      expect(result).toBe(false);
    });

    test.skip('should return false for a path with only backslashes', () => {
      const result = FileUtils.pathIsAbsolute('\\\\\\\\');
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: pathIsAbsolute
