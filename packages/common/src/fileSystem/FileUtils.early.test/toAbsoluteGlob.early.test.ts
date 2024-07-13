
// Unit tests for: toAbsoluteGlob

import { runtime } from "../../runtimes";





import { FileUtils } from '../FileUtils';


describe('FileUtils.toAbsoluteGlob() toAbsoluteGlob method', () => {
  // Mocking the runtime.path.join and path.relative methods
  const originalPathJoin = runtime.path.join;
  const originalPathRelative = runtime.path.relative;

  beforeAll(() => {
    runtime.path.join = jest.fn((...args) => args.join('/'));
    runtime.path.relative = jest.fn((from, to) => to.replace(from, ''));
  });

  afterAll(() => {
    runtime.path.join = originalPathJoin;
    runtime.path.relative = originalPathRelative;
  });

  describe('Happy Path', () => {
    test('should convert a relative glob to an absolute glob', () => {
      const glob = 'src/**/*.ts';
      const cwd = '/home/user/project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('/home/user/project/src/**/*.ts');
    });

    test('should handle negated globs correctly', () => {
      const glob = '!src/**/*.ts';
      const cwd = '/home/user/project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('!/home/user/project/src/**/*.ts');
    });

    test('should handle globs with leading "./"', () => {
      const glob = './src/**/*.ts';
      const cwd = '/home/user/project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('/home/user/project/src/**/*.ts');
    });

    test('should handle globs with trailing "/"', () => {
      const glob = 'src/';
      const cwd = '/home/user/project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('/home/user/project/src/');
    });

    test('should handle globs that are just "."', () => {
      const glob = '.';
      const cwd = '/home/user/project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('/home/user/project');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty glob', () => {
      const glob = '';
      const cwd = '/home/user/project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('/home/user/project');
    });

    test('should handle absolute globs', () => {
      const glob = '/absolute/path/**/*.ts';
      const cwd = '/home/user/project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('/absolute/path/**/*.ts');
    });

    test.skip('should handle Windows absolute paths', () => {
      const glob = 'C:\\absolute\\path\\**\\*.ts';
      const cwd = 'C:\\home\\user\\project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('C:/absolute/path/**/*.ts');
    });

    test.skip('should handle UNC paths', () => {
      const glob = '\\\\server\\share\\**\\*.ts';
      const cwd = 'C:\\home\\user\\project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('\\\\server/share/**/*.ts');
    });

    test.skip('should handle Azure absolute paths', () => {
      const glob = '\\\\?\\C:\\absolute\\path\\**\\*.ts';
      const cwd = 'C:\\home\\user\\project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('\\\\?/C:/absolute/path/**/*.ts');
    });

    test.skip('should handle globs with leading "\\"', () => {
      const glob = '\\src\\**\\*.ts';
      const cwd = 'C:\\home\\user\\project';
      const result = FileUtils.toAbsoluteGlob(glob, cwd);
      expect(result).toBe('C:/home/user/project/src/**/*.ts');
    });
  });
});

// End of unit tests for: toAbsoluteGlob
