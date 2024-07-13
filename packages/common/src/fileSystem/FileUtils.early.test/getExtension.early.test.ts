
// Unit tests for: getExtension




import { StandardizedFilePath } from "../StandardizedFilePath";


import { FileUtils } from '../FileUtils';


describe('FileUtils.getExtension() getExtension method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should return the correct extension for a standard file', () => {
      const filePath: StandardizedFilePath = 'example/file.txt' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('.txt');
    });

    test('should return the correct extension for a file with multiple dots', () => {
      const filePath: StandardizedFilePath = 'example/file.name.with.dots.txt' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('.txt');
    });

    test('should return the correct extension for a TypeScript declaration file', () => {
      const filePath: StandardizedFilePath = 'example/file.d.ts' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('.d.ts');
    });

    test('should return the correct extension for a JavaScript map file', () => {
      const filePath: StandardizedFilePath = 'example/file.js.map' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('.js.map');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should return an empty string for a file with no extension', () => {
      const filePath: StandardizedFilePath = 'example/file' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('');
    });

    test('should return an empty string for a hidden file with no extension', () => {
      const filePath: StandardizedFilePath = 'example/.hiddenfile' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('');
    });

    test('should return an empty string for a file with a leading dot and no extension', () => {
      const filePath: StandardizedFilePath = '.gitignore' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('');
    });

    test('should return the correct extension for a file with a leading dot and an extension', () => {
      const filePath: StandardizedFilePath = '.env.local' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('.local');
    });

    test('should return an empty string for an empty file path', () => {
      const filePath: StandardizedFilePath = '' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('');
    });

    test('should return an empty string for a file path that is just a dot', () => {
      const filePath: StandardizedFilePath = '.' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('');
    });

    test.skip('should return an empty string for a file path that is just two dots', () => {
      const filePath: StandardizedFilePath = '..' as StandardizedFilePath;
      const result = FileUtils.getExtension(filePath);
      expect(result).toBe('');
    });
  });
});

// End of unit tests for: getExtension
