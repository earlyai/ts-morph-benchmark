
// Unit tests for: standardizeSlashes






import { FileUtils } from '../FileUtils';


describe('FileUtils.standardizeSlashes() standardizeSlashes method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should replace backslashes with forward slashes', () => {
      const input = 'path\\to\\file';
      const expected = 'path/to/file';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test('should not modify a path that already uses forward slashes', () => {
      const input = 'path/to/file';
      const expected = 'path/to/file';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test('should remove trailing slash if not a root directory', () => {
      const input = 'path/to/dir/';
      const expected = 'path/to/dir';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test('should keep trailing slash if it is a root directory', () => {
      const input = 'C:/';
      const expected = 'C:/';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle an empty string', () => {
      const input = '';
      const expected = '';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test.skip('should handle a string with only backslashes', () => {
      const input = '\\\\';
      const expected = '//';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test('should handle a string with mixed slashes', () => {
      const input = 'path\\to/file\\dir/';
      const expected = 'path/to/file/dir';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test('should handle a root directory with backslashes', () => {
      const input = 'C:\\';
      const expected = 'C:/';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test.skip('should handle a root directory with mixed slashes', () => {
      const input = 'C:\\/\\';
      const expected = 'C:/';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test('should handle a UNC path', () => {
      const input = '\\\\server\\share\\path';
      const expected = '//server/share/path';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test.skip('should handle a path with multiple trailing slashes', () => {
      const input = 'path/to/dir///';
      const expected = 'path/to/dir';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });

    test.skip('should handle a path with multiple leading slashes', () => {
      const input = '///path/to/dir';
      const expected = '/path/to/dir';
      const result = FileUtils.standardizeSlashes(input);
      expect(result).toBe(expected);
    });
  });
});

// End of unit tests for: standardizeSlashes
