
// Unit tests for: getLibFolderPath


import { errors } from "../errors";


import { nameof } from "../utils";

import { getLibFolderPath, libFolderInMemoryPath } from '../getLibFiles';


jest.mock("../utils", () => {
  const actual = jest.requireActual("../utils");
  return {
    ...actual,
    nameof: jest.fn(),
  };
});

describe('getLibFolderPath() getLibFolderPath method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    test('should return the provided libFolderPath when libFolderPath is specified and skipLoadingLibFiles is not true', () => {
      const options = { libFolderPath: '/custom/lib/path' };
      const result = getLibFolderPath(options);
      expect(result).toBe(options.libFolderPath);
    });

    test('should return the default libFolderInMemoryPath when libFolderPath is not specified', () => {
      const options = {};
      const result = getLibFolderPath(options);
      expect(result).toBe(libFolderInMemoryPath);
    });
  });

  describe('Edge Cases', () => {
    test('should throw an error when libFolderPath is specified and skipLoadingLibFiles is true', () => {
      const options = { libFolderPath: '/custom/lib/path', skipLoadingLibFiles: true };
      (nameof as jest.Mock).mockReturnValueOnce('skipLoadingLibFiles').mockReturnValueOnce('libFolderPath');

      expect(() => getLibFolderPath(options)).toThrow(
        new errors.InvalidOperationError(
          'Cannot set skipLoadingLibFiles to true when libFolderPath is provided.'
        )
      );
    });

    test('should handle null values gracefully', () => {
      const options = { libFolderPath: null };
      const result = getLibFolderPath(options);
      expect(result).toBe(libFolderInMemoryPath);
    });

    test('should handle undefined values gracefully', () => {
      const options = { libFolderPath: undefined };
      const result = getLibFolderPath(options);
      expect(result).toBe(libFolderInMemoryPath);
    });

    test('should handle empty object as options', () => {
      const options = {};
      const result = getLibFolderPath(options);
      expect(result).toBe(libFolderInMemoryPath);
    });
  });
});

// End of unit tests for: getLibFolderPath
