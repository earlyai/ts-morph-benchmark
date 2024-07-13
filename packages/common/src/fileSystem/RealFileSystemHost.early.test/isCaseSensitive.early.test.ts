
// Unit tests for: isCaseSensitive


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      isCaseSensitive: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.isCaseSensitive() isCaseSensitive method', () => {
  let realFileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    realFileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should return true when the file system is case sensitive', () => {
      // Arrange
      (runtime.fs.isCaseSensitive as jest.Mock).mockReturnValue(true);

      // Act
      const result = realFileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBe(true);
    });

    test('should return false when the file system is not case sensitive', () => {
      // Arrange
      (runtime.fs.isCaseSensitive as jest.Mock).mockReturnValue(false);

      // Act
      const result = realFileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle the case when isCaseSensitive is not defined in the runtime', () => {
      // Arrange
      (runtime.fs.isCaseSensitive as jest.Mock).mockReturnValue(undefined);

      // Act
      const result = realFileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBeUndefined();
    });

    test('should handle the case when isCaseSensitive throws an error', () => {
      // Arrange
      (runtime.fs.isCaseSensitive as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act & Assert
      expect(() => realFileSystemHost.isCaseSensitive()).toThrow('Unexpected error');
    });
  });
});

// End of unit tests for: isCaseSensitive
