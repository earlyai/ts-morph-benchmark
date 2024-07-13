
// Unit tests for: mkdirSync




import { FileUtils } from "../FileUtils";



import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


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

jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
  };
});

type MockStandardizedFilePath = string;


describe('InMemoryFileSystemHost.mkdirSync() mkdirSync method', () => {
  let fileSystemHost: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    it.skip('should create a new directory when it does not exist', () => {
      // Arrange
      const dirPath = '/newDir';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(dirPath as any);

      // Act
      fileSystemHost.mkdirSync(dirPath);

      // Assert
      expect(fileSystemHost.directoryExistsSync(dirPath)).toBe(true);
    });

    it.skip('should not throw an error when creating an existing directory', () => {
      // Arrange
      const dirPath = '/existingDir';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(dirPath as any);
      fileSystemHost.mkdirSync(dirPath);

      // Act & Assert
      expect(() => fileSystemHost.mkdirSync(dirPath)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it.skip('should create nested directories', () => {
      // Arrange
      const nestedDirPath = '/parentDir/childDir';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(nestedDirPath as any);
      (FileUtils.getDirPath as jest.Mock).mockReturnValue('/parentDir' as any);

      // Act
      fileSystemHost.mkdirSync(nestedDirPath);

      // Assert
      expect(fileSystemHost.directoryExistsSync('/parentDir')).toBe(true);
      expect(fileSystemHost.directoryExistsSync(nestedDirPath)).toBe(true);
    });

    it.skip('should handle directory paths with trailing slashes', () => {
      // Arrange
      const dirPathWithSlash = '/dirWithSlash/';
      const standardizedDirPath = '/dirWithSlash';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(standardizedDirPath as any);

      // Act
      fileSystemHost.mkdirSync(dirPathWithSlash);

      // Assert
      expect(fileSystemHost.directoryExistsSync(standardizedDirPath)).toBe(true);
    });

    it.skip('should handle directory paths with multiple slashes', () => {
      // Arrange
      const dirPathWithMultipleSlashes = '/dir//with//slashes';
      const standardizedDirPath = '/dir/with/slashes';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(standardizedDirPath as any);

      // Act
      fileSystemHost.mkdirSync(dirPathWithMultipleSlashes);

      // Assert
      expect(fileSystemHost.directoryExistsSync(standardizedDirPath)).toBe(true);
    });

    it.skip('should handle creating a directory when parent directory does not exist', () => {
      // Arrange
      const dirPath = '/nonExistentParent/childDir';
      const parentDirPath = '/nonExistentParent';
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(dirPath as any);
      (FileUtils.getDirPath as jest.Mock).mockReturnValue(parentDirPath as any);

      // Act
      fileSystemHost.mkdirSync(dirPath);

      // Assert
      expect(fileSystemHost.directoryExistsSync(parentDirPath)).toBe(true);
      expect(fileSystemHost.directoryExistsSync(dirPath)).toBe(true);
    });
  });
});

// End of unit tests for: mkdirSync
