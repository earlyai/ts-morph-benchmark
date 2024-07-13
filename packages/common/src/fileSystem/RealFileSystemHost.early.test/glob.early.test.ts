
// Unit tests for: glob


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      glob: jest.fn(),
      globSync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.glob() glob method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should return matched file paths for given patterns', async () => {
      // Arrange
      const patterns = ['src/**/*.ts', 'test/**/*.ts'];
      const expectedPaths = ['src/index.ts', 'test/index.test.ts'];
      (runtime.fs.glob as jest.Mock).mockResolvedValue(expectedPaths);

      // Act
      const result = await fileSystemHost.glob(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.glob).toHaveBeenCalledWith(['src/**/*.ts', 'test/**/*.ts']);
    });

    test('should convert backslashes to forward slashes in patterns', async () => {
      // Arrange
      const patterns = ['src\\**\\*.ts', 'test\\**\\*.ts'];
      const expectedPaths = ['src/index.ts', 'test/index.test.ts'];
      (runtime.fs.glob as jest.Mock).mockResolvedValue(expectedPaths);

      // Act
      const result = await fileSystemHost.glob(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.glob).toHaveBeenCalledWith(['src/**/*.ts', 'test/**/*.ts']);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty patterns array', async () => {
      // Arrange
      const patterns: string[] = [];
      const expectedPaths: string[] = [];
      (runtime.fs.glob as jest.Mock).mockResolvedValue(expectedPaths);

      // Act
      const result = await fileSystemHost.glob(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.glob).toHaveBeenCalledWith([]);
    });

    test('should handle patterns with no matches', async () => {
      // Arrange
      const patterns = ['nonexistent/**/*.ts'];
      const expectedPaths: string[] = [];
      (runtime.fs.glob as jest.Mock).mockResolvedValue(expectedPaths);

      // Act
      const result = await fileSystemHost.glob(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.glob).toHaveBeenCalledWith(['nonexistent/**/*.ts']);
    });

    test('should reject with an error if glob fails', async () => {
      // Arrange
      const patterns = ['src/**/*.ts'];
      const error = new Error('Glob failed');
      (runtime.fs.glob as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(fileSystemHost.glob(patterns)).rejects.toThrow('Glob failed');
      expect(runtime.fs.glob).toHaveBeenCalledWith(['src/**/*.ts']);
    });
  });
});

// End of unit tests for: glob
