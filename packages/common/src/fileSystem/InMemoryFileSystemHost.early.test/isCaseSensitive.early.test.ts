
// Unit tests for: isCaseSensitive







import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


// Mocking the necessary modules
jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

jest.mock("../FileUtils", () => {
  const actual = jest.requireActual("../FileUtils");
  return {
    ...actual,
    getStandardizedAbsolutePath: jest.fn(),
    getDirPath: jest.fn(),
    getBaseName: jest.fn(),
    getRelativePathTo: jest.fn(),
    pathJoin: jest.fn(),
    pathStartsWith: jest.fn(),
  };
});

type MockStandardizedFilePath = string;


describe('InMemoryFileSystemHost.isCaseSensitive() isCaseSensitive method', () => {
  let fileSystemHost: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should return true indicating the file system is case sensitive', () => {
      // Arrange & Act
      const result = fileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should always return true regardless of the state of the file system', () => {
      // Arrange
      const mockFileSystemHost = new InMemoryFileSystemHost();
      jest.spyOn(mockFileSystemHost as any, 'isCaseSensitive').mockReturnValue(true);

      // Act
      const result = mockFileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBe(true);
    });

    test('should return true even if directories are added', () => {
      // Arrange
      const mockDirPath: MockStandardizedFilePath = '/mockDir' as any;
      fileSystemHost.mkdirSync(mockDirPath);

      // Act
      const result = fileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBe(true);
    });

    test('should return true even if files are added', () => {
      // Arrange
      const mockFilePath: MockStandardizedFilePath = '/mockFile.txt' as any;
      fileSystemHost.writeFileSync(mockFilePath, 'mock content');

      // Act
      const result = fileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBe(true);
    });

    test('should return true even if directories and files are deleted', () => {
      // Arrange
      const mockDirPath: MockStandardizedFilePath = '/mockDir' as any;
      const mockFilePath: MockStandardizedFilePath = '/mockDir/mockFile.txt' as any;
      fileSystemHost.mkdirSync(mockDirPath);
      fileSystemHost.writeFileSync(mockFilePath, 'mock content');
      fileSystemHost.deleteSync(mockFilePath);
      fileSystemHost.deleteSync(mockDirPath);

      // Act
      const result = fileSystemHost.isCaseSensitive();

      // Assert
      expect(result).toBe(true);
    });
  });
});

// End of unit tests for: isCaseSensitive
