
// Unit tests for: pathEndsWith






import { FileUtils } from '../FileUtils';


describe('FileUtils.pathEndsWith() pathEndsWith method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should return true when the path ends with the specified path', () => {
      const fileOrDirPath = '/home/user/project/file.txt';
      const endsWithPath = 'project/file.txt';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(true);
    });

    test('should return true when the path ends with the specified path with leading slashes', () => {
      const fileOrDirPath = '/home/user/project/file.txt';
      const endsWithPath = '/project/file.txt';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(true);
    });

    test('should return true when the path ends with the specified path with trailing slashes', () => {
      const fileOrDirPath = '/home/user/project/file.txt/';
      const endsWithPath = 'project/file.txt/';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(true);
    });

    test('should return true when both paths are identical', () => {
      const fileOrDirPath = '/home/user/project/file.txt';
      const endsWithPath = '/home/user/project/file.txt';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(true);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should return false when the path does not end with the specified path', () => {
      const fileOrDirPath = '/home/user/project/file.txt';
      const endsWithPath = 'project/otherfile.txt';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test('should return false when the specified path is longer than the actual path', () => {
      const fileOrDirPath = '/home/user/project/file.txt';
      const endsWithPath = 'home/user/project/file.txt/extra';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test('should return false when the specified path is empty', () => {
      const fileOrDirPath = '/home/user/project/file.txt';
      const endsWithPath = '';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test('should return false when the actual path is empty', () => {
      const fileOrDirPath = '';
      const endsWithPath = 'project/file.txt';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test.skip('should return false when both paths are empty', () => {
      const fileOrDirPath = '';
      const endsWithPath = '';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test('should return false when the actual path is undefined', () => {
      const fileOrDirPath = undefined;
      const endsWithPath = 'project/file.txt';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test('should return false when the specified path is undefined', () => {
      const fileOrDirPath = '/home/user/project/file.txt';
      const endsWithPath = undefined;
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test.skip('should return false when both paths are undefined', () => {
      const fileOrDirPath = undefined;
      const endsWithPath = undefined;
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(false);
    });

    test('should return true when the specified path is a single slash and the actual path ends with a slash', () => {
      const fileOrDirPath = '/';
      const endsWithPath = '/';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(true);
    });

    test('should return true when the specified path is a single slash and the actual path is a root directory', () => {
      const fileOrDirPath = '/';
      const endsWithPath = '/';
      const result = FileUtils.pathEndsWith(fileOrDirPath, endsWithPath);
      expect(result).toBe(true);
    });
  });
});

// End of unit tests for: pathEndsWith
