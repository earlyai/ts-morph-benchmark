
// Unit tests for: isRootDirPath






import { FileUtils } from '../FileUtils';


describe('FileUtils.isRootDirPath() isRootDirPath method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for Unix root directory "/"', () => {
      const result = FileUtils.isRootDirPath('/');
      expect(result).toBe(true);
    });

    test('should return true for Windows root directory "C:/"', () => {
      const result = FileUtils.isRootDirPath('C:/');
      expect(result).toBe(true);
    });

    test('should return true for Windows root directory "C:\\"', () => {
      const result = FileUtils.isRootDirPath('C:\\');
      expect(result).toBe(true);
    });

    test('should return true for Windows root directory with lowercase drive letter "c:/"', () => {
      const result = FileUtils.isRootDirPath('c:/');
      expect(result).toBe(true);
    });

    test('should return true for Windows root directory with lowercase drive letter "c:\\"', () => {
      const result = FileUtils.isRootDirPath('c:\\');
      expect(result).toBe(true);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for empty string', () => {
      const result = FileUtils.isRootDirPath('');
      expect(result).toBe(false);
    });

    test('should return false for relative path "./"', () => {
      const result = FileUtils.isRootDirPath('./');
      expect(result).toBe(false);
    });

    test('should return false for relative path "../"', () => {
      const result = FileUtils.isRootDirPath('../');
      expect(result).toBe(false);
    });

    test('should return false for non-root Unix path "/home/user"', () => {
      const result = FileUtils.isRootDirPath('/home/user');
      expect(result).toBe(false);
    });

    test('should return false for non-root Windows path "C:/Users"', () => {
      const result = FileUtils.isRootDirPath('C:/Users');
      expect(result).toBe(false);
    });

    test('should return false for non-root Windows path "C:\\Users"', () => {
      const result = FileUtils.isRootDirPath('C:\\Users');
      expect(result).toBe(false);
    });

    test('should return false for non-root Windows path with lowercase drive letter "c:/Users"', () => {
      const result = FileUtils.isRootDirPath('c:/Users');
      expect(result).toBe(false);
    });

    test('should return false for non-root Windows path with lowercase drive letter "c:\\Users"', () => {
      const result = FileUtils.isRootDirPath('c:\\Users');
      expect(result).toBe(false);
    });

    test('should return false for Windows UNC path "\\\\server\\share"', () => {
      const result = FileUtils.isRootDirPath('\\\\server\\share');
      expect(result).toBe(false);
    });

    test('should return false for Windows Azure path "\\\\?\\C:\\path"', () => {
      const result = FileUtils.isRootDirPath('\\\\?\\C:\\path');
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isRootDirPath
