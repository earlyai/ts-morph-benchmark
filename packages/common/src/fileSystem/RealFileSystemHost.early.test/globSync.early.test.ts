
// Unit tests for: globSync


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes");
jest.mock("../FileUtils");

describe('RealFileSystemHost.globSync() globSync method', () => {
  let realFileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    realFileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should return matched file paths for given patterns', () => {
      // Arrange
      const patterns = ['**/*.ts', '**/*.js'];
      const expectedPaths = ['src/index.ts', 'src/app.js'];
      (runtime.fs.globSync as jest.Mock).mockReturnValue(expectedPaths);

      // Act
      const result = realFileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.globSync).toHaveBeenCalledWith(['**/*.ts', '**/*.js']);
    });

    it('should convert backslashes to forward slashes in patterns', () => {
      // Arrange
      const patterns = ['**\\*.ts', '**\\*.js'];
      const expectedPaths = ['src/index.ts', 'src/app.js'];
      (runtime.fs.globSync as jest.Mock).mockReturnValue(expectedPaths);

      // Act
      const result = realFileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.globSync).toHaveBeenCalledWith(['**/*.ts', '**/*.js']);
    });
  });

  describe('Edge Cases', () => {
    it('should return an empty array if no files match the patterns', () => {
      // Arrange
      const patterns = ['**/*.nonexistent'];
      (runtime.fs.globSync as jest.Mock).mockReturnValue([]);

      // Act
      const result = realFileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(runtime.fs.globSync).toHaveBeenCalledWith(['**/*.nonexistent']);
    });

    it('should handle patterns with special characters', () => {
      // Arrange
      const patterns = ['**/*.ts', '**/file[0-9].js'];
      const expectedPaths = ['src/index.ts', 'src/file1.js'];
      (runtime.fs.globSync as jest.Mock).mockReturnValue(expectedPaths);

      // Act
      const result = realFileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.globSync).toHaveBeenCalledWith(['**/*.ts', '**/file[0-9].js']);
    });

    it('should handle empty patterns array', () => {
      // Arrange
      const patterns: string[] = [];
      (runtime.fs.globSync as jest.Mock).mockReturnValue([]);

      // Act
      const result = realFileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual([]);
      expect(runtime.fs.globSync).toHaveBeenCalledWith([]);
    });

    it('should handle patterns with only backslashes', () => {
      // Arrange
      const patterns = ['**\\*.ts', '**\\*.js'];
      const expectedPaths = ['src/index.ts', 'src/app.js'];
      (runtime.fs.globSync as jest.Mock).mockReturnValue(expectedPaths);

      // Act
      const result = realFileSystemHost.globSync(patterns);

      // Assert
      expect(result).toEqual(expectedPaths);
      expect(runtime.fs.globSync).toHaveBeenCalledWith(['**/*.ts', '**/*.js']);
    });

    it('should throw an error if fs.globSync throws an error', () => {
      // Arrange
      const patterns = ['**/*.ts'];
      const error = new Error('Test error');
      (runtime.fs.globSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      expect(() => realFileSystemHost.globSync(patterns)).toThrow(error);
      expect(runtime.fs.globSync).toHaveBeenCalledWith(['**/*.ts']);
    });
  });
});

// End of unit tests for: globSync
