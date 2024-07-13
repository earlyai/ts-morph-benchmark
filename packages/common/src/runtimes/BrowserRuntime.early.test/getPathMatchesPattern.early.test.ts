
// Unit tests for: getPathMatchesPattern




import { BrowserRuntime } from '../BrowserRuntime';


describe('BrowserRuntime.getPathMatchesPattern() getPathMatchesPattern method', () => {
  let runtime: BrowserRuntime;

  beforeEach(() => {
    runtime = new BrowserRuntime();
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

    test('should return true for pattern with negation', () => {
      const path = 'src/index.ts';
      const pattern = '!src/*.js';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test('should return false for pattern with negation that matches', () => {
      const path = 'src/index.js';
      const pattern = '!src/*.js';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });

    test('should handle special characters in path', () => {
      const path = 'src/special[chars].ts';
      const pattern = 'src/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test('should handle special characters in pattern', () => {
      const path = 'src/index.ts';
      const pattern = 'src/ind?x.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(true);
    });

    test.skip('should return false for null path', () => {
      const path = null as unknown as string;
      const pattern = 'src/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });

    test.skip('should return false for null pattern', () => {
      const path = 'src/index.ts';
      const pattern = null as unknown as string;
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });

    test.skip('should return false for undefined path', () => {
      const path = undefined as unknown as string;
      const pattern = 'src/*.ts';
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });

    test.skip('should return false for undefined pattern', () => {
      const path = 'src/index.ts';
      const pattern = undefined as unknown as string;
      const result = runtime.getPathMatchesPattern(path, pattern);
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: getPathMatchesPattern
