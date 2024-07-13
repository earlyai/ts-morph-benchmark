
// Unit tests for: mkdir




import { FileUtils } from "../FileUtils";



import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


jest.mock("../FileUtils", () => {
  const actual = jest.requireActual("../FileUtils");
  return {
    ...actual,
    getStandardizedAbsolutePath: jest.fn(),
    getDirPath: jest.fn(),
  };
});

jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
  };
});

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.mkdir() mkdir method', () => {
  let fileSystemHost: InMemoryFileSystemHost;
  let mockDirPath: MockStandardizedFilePath;
  let mockStandardizedDirPath: MockStandardizedFilePath;
  let mockParentDirPath: MockStandardizedFilePath;
  let mockVirtualDirectory: MockVirtualDirectory;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
    mockDirPath = '/mockDir' as MockStandardizedFilePath;
    mockStandardizedDirPath = '/mockDir' as MockStandardizedFilePath;
    mockParentDirPath = '/' as MockStandardizedFilePath;
    mockVirtualDirectory = {
      path: mockStandardizedDirPath,
      files: new Map<MockStandardizedFilePath, string>(),
    };

    (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(mockStandardizedDirPath);
    (FileUtils.getDirPath as jest.Mock).mockReturnValue(mockParentDirPath);
  });

  describe('Happy Path', () => {
    it.skip('should create a new directory when it does not exist', async () => {
      // Arrange
      const getOrCreateDirSpy = jest.spyOn(fileSystemHost as any, '#getOrCreateDir').mockReturnValue(mockVirtualDirectory as any);

      // Act
      await fileSystemHost.mkdir(mockDirPath);

      // Assert
      expect(getOrCreateDirSpy).toHaveBeenCalledWith(mockStandardizedDirPath);
    });

    it.skip('should resolve the promise when directory is created successfully', async () => {
      // Arrange
      jest.spyOn(fileSystemHost as any, '#getOrCreateDir').mockReturnValue(mockVirtualDirectory as any);

      // Act & Assert
      await expect(fileSystemHost.mkdir(mockDirPath)).resolves.toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle creating a directory that already exists', async () => {
      // Arrange
      fileSystemHost['#directories'].set(mockStandardizedDirPath, mockVirtualDirectory as any);

      // Act
      await fileSystemHost.mkdir(mockDirPath);

      // Assert
      expect(fileSystemHost['#directories'].has(mockStandardizedDirPath)).toBe(true);
    });

    it.skip('should create parent directories if they do not exist', async () => {
      // Arrange
      const mockParentVirtualDirectory: MockVirtualDirectory = {
        path: mockParentDirPath,
        files: new Map<MockStandardizedFilePath, string>(),
      };
      jest.spyOn(fileSystemHost as any, '#getOrCreateDir').mockImplementation((dirPath: MockStandardizedFilePath) => {
        if (dirPath === mockParentDirPath) {
          return mockParentVirtualDirectory as any;
        }
        return mockVirtualDirectory as any;
      });

      // Act
      await fileSystemHost.mkdir(mockDirPath);

      // Assert
      expect(fileSystemHost['#directories'].has(mockParentDirPath)).toBe(true);
      expect(fileSystemHost['#directories'].has(mockStandardizedDirPath)).toBe(true);
    });

    it.skip('should handle invalid directory paths gracefully', async () => {
      // Arrange
      const invalidDirPath = '' as MockStandardizedFilePath;
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(invalidDirPath);

      // Act & Assert
      await expect(fileSystemHost.mkdir(invalidDirPath)).resolves.toBeUndefined();
    });
  });
});

// End of unit tests for: mkdir
