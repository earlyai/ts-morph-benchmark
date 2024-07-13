
// Unit tests for: getLibFiles

import { libFiles } from "../data/libFiles";




import { getLibFiles } from '../getLibFiles';


// Mocking the necessary modules
jest.mock("../utils", () => {
  const actual = jest.requireActual("../utils");
  return {
    ...actual,
    nameof: jest.fn(),
  };
});

jest.mock("../data/libFiles", () => {
  const actual = jest.requireActual("../data/libFiles");
  return {
    ...actual,
  };
});

jest.mock("../errors", () => {
  const actual = jest.requireActual("../errors");
  return {
    ...actual,
  };
});

jest.mock("../fileSystem", () => {
  const actual = jest.requireActual("../fileSystem");
  return {
    ...actual,
  };
});

describe('getLibFiles() getLibFiles method', () => {
  describe('Happy Path', () => {
    test('should return the list of lib files', () => {
      // Arrange
      const expectedLibFiles = libFiles;

      // Act
      const result = getLibFiles();

      // Assert
      expect(result).toBe(expectedLibFiles);
    });
  });

  describe('Edge Cases', () => {
    test('should handle the case when libFiles is an empty array', () => {
      // Arrange
      const originalLibFiles = libFiles;
      (libFiles as any) = []; // Temporarily override libFiles

      // Act
      const result = getLibFiles();

      // Assert
      expect(result).toEqual([]);

      // Cleanup
      (libFiles as any) = originalLibFiles; // Restore original libFiles
    });

    test('should handle the case when libFiles is undefined', () => {
      // Arrange
      const originalLibFiles = libFiles;
      (libFiles as any) = undefined; // Temporarily override libFiles

      // Act
      const result = getLibFiles();

      // Assert
      expect(result).toBeUndefined();

      // Cleanup
      (libFiles as any) = originalLibFiles; // Restore original libFiles
    });

    test('should handle the case when libFiles is null', () => {
      // Arrange
      const originalLibFiles = libFiles;
      (libFiles as any) = null; // Temporarily override libFiles

      // Act
      const result = getLibFiles();

      // Assert
      expect(result).toBeNull();

      // Cleanup
      (libFiles as any) = originalLibFiles; // Restore original libFiles
    });
  });
});

// End of unit tests for: getLibFiles
