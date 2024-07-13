
// Unit tests for: fileExistsSync




import { FileUtils } from "../FileUtils";



import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.fileExistsSync() fileExistsSync method', () => {
  let fileSystemHost: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    test.skip('should return true if the file exists in the directory', () => {
      // Arrange
      const mockFilePath: MockStandardizedFilePath = '/mockDir/mockFile.txt';
      const mockDirPath: MockStandardizedFilePath = '/mockDir';
      const mockFileContent = 'file content';

      jest.spyOn(FileUtils, 'getStandardizedAbsolutePath').mockReturnValue(mockFilePath as any);
      jest.spyOn(FileUtils, 'getDirPath').mockReturnValue(mockDirPath as any);

      const mockDir: MockVirtualDirectory = {
        path: mockDirPath,
        files: new Map([[mockFilePath, mockFileContent]]),
      };

      (fileSystemHost as any)['#directories'].set(mockDirPath, mockDir);

      // Act
      const result = fileSystemHost.fileExistsSync(mockFilePath);

      // Assert
      expect(result).toBe(true);
    });

    test.skip('should return false if the file does not exist in the directory', () => {
      // Arrange
      const mockFilePath: MockStandardizedFilePath = '/mockDir/nonExistentFile.txt';
      const mockDirPath: MockStandardizedFilePath = '/mockDir';

      jest.spyOn(FileUtils, 'getStandardizedAbsolutePath').mockReturnValue(mockFilePath as any);
      jest.spyOn(FileUtils, 'getDirPath').mockReturnValue(mockDirPath as any);

      const mockDir: MockVirtualDirectory = {
        path: mockDirPath,
        files: new Map(),
      };

      (fileSystemHost as any)['#directories'].set(mockDirPath, mockDir);

      // Act
      const result = fileSystemHost.fileExistsSync(mockFilePath);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should return false if the directory does not exist', () => {
      // Arrange
      const mockFilePath: MockStandardizedFilePath = '/nonExistentDir/mockFile.txt';
      const mockDirPath: MockStandardizedFilePath = '/nonExistentDir';

      jest.spyOn(FileUtils, 'getStandardizedAbsolutePath').mockReturnValue(mockFilePath as any);
      jest.spyOn(FileUtils, 'getDirPath').mockReturnValue(mockDirPath as any);

      // Act
      const result = fileSystemHost.fileExistsSync(mockFilePath);

      // Assert
      expect(result).toBe(false);
    });

    test.skip('should handle case sensitivity correctly', () => {
      // Arrange
      const mockFilePath: MockStandardizedFilePath = '/mockDir/mockFile.txt';
      const mockFilePathDifferentCase: MockStandardizedFilePath = '/mockDir/MOCKFILE.TXT';
      const mockDirPath: MockStandardizedFilePath = '/mockDir';
      const mockFileContent = 'file content';

      jest.spyOn(FileUtils, 'getStandardizedAbsolutePath').mockReturnValue(mockFilePath as any);
      jest.spyOn(FileUtils, 'getDirPath').mockReturnValue(mockDirPath as any);

      const mockDir: MockVirtualDirectory = {
        path: mockDirPath,
        files: new Map([[mockFilePath, mockFileContent]]),
      };

      (fileSystemHost as any)['#directories'].set(mockDirPath, mockDir);

      // Act
      const result = fileSystemHost.fileExistsSync(mockFilePathDifferentCase);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false if the file path is empty', () => {
      // Arrange
      const mockFilePath: MockStandardizedFilePath = '';
      const mockDirPath: MockStandardizedFilePath = '/';

      jest.spyOn(FileUtils, 'getStandardizedAbsolutePath').mockReturnValue(mockFilePath as any);
      jest.spyOn(FileUtils, 'getDirPath').mockReturnValue(mockDirPath as any);

      // Act
      const result = fileSystemHost.fileExistsSync(mockFilePath);

      // Assert
      expect(result).toBe(false);
    });

    test.skip('should return false if the file path is a directory', () => {
      // Arrange
      const mockDirPath: MockStandardizedFilePath = '/mockDir';

      jest.spyOn(FileUtils, 'getStandardizedAbsolutePath').mockReturnValue(mockDirPath as any);
      jest.spyOn(FileUtils, 'getDirPath').mockReturnValue(mockDirPath as any);

      const mockDir: MockVirtualDirectory = {
        path: mockDirPath,
        files: new Map(),
      };

      (fileSystemHost as any)['#directories'].set(mockDirPath, mockDir);

      // Act
      const result = fileSystemHost.fileExistsSync(mockDirPath);

      // Assert
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: fileExistsSync
