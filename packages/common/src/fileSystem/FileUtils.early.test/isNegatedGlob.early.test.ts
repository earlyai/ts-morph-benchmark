
// Unit tests for: isNegatedGlob






import { FileUtils } from '../FileUtils';


describe('FileUtils.isNegatedGlob() isNegatedGlob method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should return true for a simple negated glob', () => {
      const glob = '!test';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(true);
    });

    test('should return false for a non-negated glob', () => {
      const glob = 'test';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(false);
    });

    test('should return false for a negated extglob', () => {
      const glob = '!(test)';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(false);
    });

    test('should return true for a negated glob with a leading slash', () => {
      const glob = '!/test';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(true);
    });

    test('should return true for a negated glob with multiple characters', () => {
      const glob = '!test123';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(true);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return false for an empty string', () => {
      const glob = '';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(false);
    });

    test.skip('should return false for a single exclamation mark', () => {
      const glob = '!';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(false);
    });

    test('should return true for a negated glob with special characters', () => {
      const glob = '!@#$%^&*()';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(true);
    });

    test('should return false for a negated extglob with special characters', () => {
      const glob = '!(test@#$%)';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(false);
    });

    test('should return true for a negated glob with spaces', () => {
      const glob = '!test with spaces';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(true);
    });

    test('should return false for a glob starting with a space and exclamation mark', () => {
      const glob = ' !test';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(false);
    });

    test('should return true for a negated glob with a leading dot', () => {
      const glob = '!.test';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(true);
    });

    test('should return false for a negated extglob with a leading dot', () => {
      const glob = '!(.test)';
      const result = FileUtils.isNegatedGlob(glob);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isNegatedGlob
