
// Unit tests for: isNotExistsError






import { FileUtils } from '../FileUtils';


describe('FileUtils.isNotExistsError() isNotExistsError method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for an error with code ENOENT', () => {
      const error = { code: FileUtils.ENOENT };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(true);
    });

    test('should return true for an error with constructor name NotFound', () => {
      const error = { constructor: { name: 'NotFound' } };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(true);
    });

    test('should return false for an error with a different code', () => {
      const error = { code: 'EACCES' };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for an error with a different constructor name', () => {
      const error = { constructor: { name: 'SomeOtherError' } };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for null error', () => {
      const error = null;
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for undefined error', () => {
      const error = undefined;
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for an error without a code or constructor', () => {
      const error = {};
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for an error with a null code and constructor', () => {
      const error = { code: null, constructor: null };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for an error with an empty string code and constructor name', () => {
      const error = { code: '', constructor: { name: '' } };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for an error with a numeric code', () => {
      const error = { code: 404 };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for an error with a boolean code', () => {
      const error = { code: true };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });

    test('should return false for an error with a boolean constructor name', () => {
      const error = { constructor: { name: true } };
      const result = FileUtils.isNotExistsError(error);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isNotExistsError
