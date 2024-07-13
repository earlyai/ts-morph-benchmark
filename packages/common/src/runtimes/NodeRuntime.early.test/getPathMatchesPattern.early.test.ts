
// Unit tests for: getPathMatchesPattern








import { NodeRuntime } from '../NodeRuntime';


describe('NodeRuntime.getPathMatchesPattern() getPathMatchesPattern method', () => {
  let runtime: NodeRuntime;

  beforeAll(() => {
    runtime = new NodeRuntime();
  });

  describe('Happy Path', () => {
    test('should return true for exact match', () => {
      const path = 'src/index.ts';
      const pattern = 'src/index.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test('should return true for wildcard match', () => {
      const path = 'src/index.ts';
      const pattern = 'src/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test('should return true for nested wildcard match', () => {
      const path = 'src/components/Button/index.ts';
      const pattern = 'src/components/**/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test('should return false for non-matching pattern', () => {
      const path = 'src/index.ts';
      const pattern = 'src/*.js';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should return false for empty path', () => {
      const path = '';
      const pattern = 'src/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });

    test('should return false for empty pattern', () => {
      const path = 'src/index.ts';
      const pattern = '';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });

    test('should return true for pattern with leading slash', () => {
      const path = '/src/index.ts';
      const pattern = '/src/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test.skip('should return true for pattern with trailing slash', () => {
      const path = 'src/index.ts';
      const pattern = 'src/*.ts/';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test('should return false for case-sensitive mismatch', () => {
      const path = 'src/Index.ts';
      const pattern = 'src/index.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });

    test('should return true for negated pattern that does not match', () => {
      const path = 'src/index.ts';
      const pattern = '!src/*.js';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test('should return false for negated pattern that matches', () => {
      const path = 'src/index.ts';
      const pattern = '!src/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: getPathMatchesPattern
