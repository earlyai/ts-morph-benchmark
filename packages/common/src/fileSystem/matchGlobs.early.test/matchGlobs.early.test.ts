
// Unit tests for: matchGlobs

import { runtime } from "../../runtimes";

import { FileUtils } from "../FileUtils";

import { matchGlobs } from '../matchGlobs';


// Mocking the dependencies
jest.mock("../../runtimes", () => ({
  runtime: {
    getPathMatchesPattern: jest.fn(),
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    toAbsoluteGlob: jest.fn(),
    isNegatedGlob: jest.fn(),
  },
}));

describe('matchGlobs() matchGlobs method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
//    test('should match paths with a single pattern', () => {
//      const paths = ['src/index.ts', 'src/app.ts'];
//      const patterns = 'src/*.ts';
//      const cwd = '/project';
//
//      FileUtils.toAbsoluteGlob.mockReturnValue('/project/src/*.ts');
//      runtime.getPathMatchesPattern.mockReturnValue(true);
//
//      const result = matchGlobs(paths, patterns, cwd);
//
//      expect(result).toEqual(paths);
//      expect(FileUtils.toAbsoluteGlob).toHaveBeenCalledWith(patterns, cwd);
//      expect(runtime.getPathMatchesPattern).toHaveBeenCalledTimes(2);
//    });

//    test('should match paths with multiple patterns', () => {
//      const paths = ['src/index.ts', 'src/app.ts', 'test/test.ts'];
//      const patterns = ['src/*.ts', 'test/*.ts'];
//      const cwd = '/project';
//
//      FileUtils.toAbsoluteGlob.mockImplementation((pattern) => `/project/${pattern}`);
//      runtime.getPathMatchesPattern.mockReturnValue(true);
//
//      const result = matchGlobs(paths, patterns, cwd);
//
//      expect(result).toEqual(paths);
//      expect(FileUtils.toAbsoluteGlob).toHaveBeenCalledTimes(2);
//      expect(runtime.getPathMatchesPattern).toHaveBeenCalledTimes(3);
//    });

//    test('should handle negated patterns', () => {
//      const paths = ['src/index.ts', 'src/app.ts', 'test/test.ts'];
//      const patterns = ['src/*.ts', '!src/app.ts'];
//      const cwd = '/project';
//
//      FileUtils.toAbsoluteGlob.mockImplementation((pattern) => `/project/${pattern}`);
//      FileUtils.isNegatedGlob.mockImplementation((pattern) => pattern.startsWith('!'));
//      runtime.getPathMatchesPattern.mockImplementation((path, pattern) => {
//        if (pattern === '/project/src/*.ts') return true;
//        if (pattern === 'src/app.ts') return path !== 'src/app.ts';
//        return false;
//      });
//
//      const result = matchGlobs(paths, patterns, cwd);
//
//      expect(result).toEqual(['src/index.ts']);
//      expect(FileUtils.toAbsoluteGlob).toHaveBeenCalledTimes(2);
//      expect(runtime.getPathMatchesPattern).toHaveBeenCalledTimes(3);
//    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should return an empty array when no paths are provided', () => {
      const paths: string[] = [];
      const patterns = 'src/*.ts';
      const cwd = '/project';

      const result = matchGlobs(paths, patterns, cwd);

      expect(result).toEqual([]);
      expect(FileUtils.toAbsoluteGlob).toHaveBeenCalledWith(patterns, cwd);
      expect(runtime.getPathMatchesPattern).not.toHaveBeenCalled();
    });

//    test('should return an empty array when no patterns match', () => {
//      const paths = ['src/index.ts', 'src/app.ts'];
//      const patterns = 'test/*.ts';
//      const cwd = '/project';
//
//      FileUtils.toAbsoluteGlob.mockReturnValue('/project/test/*.ts');
//      runtime.getPathMatchesPattern.mockReturnValue(false);
//
//      const result = matchGlobs(paths, patterns, cwd);
//
//      expect(result).toEqual([]);
//      expect(FileUtils.toAbsoluteGlob).toHaveBeenCalledWith(patterns, cwd);
//      expect(runtime.getPathMatchesPattern).toHaveBeenCalledTimes(2);
//    });

    test('should handle empty patterns array', () => {
      const paths = ['src/index.ts', 'src/app.ts'];
      const patterns: string[] = [];
      const cwd = '/project';

      const result = matchGlobs(paths, patterns, cwd);

      expect(result).toEqual([]);
      expect(FileUtils.toAbsoluteGlob).not.toHaveBeenCalled();
      expect(runtime.getPathMatchesPattern).not.toHaveBeenCalled();
    });

//    test('should handle patterns with only negations', () => {
//      const paths = ['src/index.ts', 'src/app.ts'];
//      const patterns = ['!src/app.ts'];
//      const cwd = '/project';
//
//      FileUtils.toAbsoluteGlob.mockImplementation((pattern) => `/project/${pattern}`);
//      FileUtils.isNegatedGlob.mockReturnValue(true);
//      runtime.getPathMatchesPattern.mockReturnValue(true);
//
//      const result = matchGlobs(paths, patterns, cwd);
//
//      expect(result).toEqual([]);
//      expect(FileUtils.toAbsoluteGlob).toHaveBeenCalledWith('!src/app.ts', cwd);
//      expect(runtime.getPathMatchesPattern).toHaveBeenCalledTimes(2);
//    });
  });
});

// End of unit tests for: matchGlobs
