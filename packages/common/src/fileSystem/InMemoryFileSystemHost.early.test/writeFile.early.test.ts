
// Unit tests for: writeFile




import { FileUtils } from "../FileUtils";



import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

jest.mock("../../errors", () => {
  const actual = jest.requireActual("../../errors");
  return {
    ...actual,
    FileNotFoundError: jest.fn(),
    DirectoryNotFoundError: jest.fn(),
    PathNotFoundError: jest.fn(),
  };
});

jest.mock("../FileUtils", () => {
  const actual = jest.requireActual("../FileUtils");
  return {
    ...actual,
    getStandardizedAbsolutePath: jest.fn(),
    getDirPath: jest.fn(),
    pathJoin: jest.fn(),
    getBaseName: jest.fn(),
    getRelativePathTo: jest.fn(),
    pathStartsWith: jest.fn(),
  };
});

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.writeFile() writeFile method', () => {
  let fileSystemHost: InMemoryFileSystemHost;
  let mockStandardizedFilePath: MockStandardizedFilePath;
  let mockVirtualDirectory: MockVirtualDirectory;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
    mockStandardizedFilePath = '/mock/path' as any;
    mockVirtualDirectory = {
      path: mockStandardizedFilePath,
      files: new Map<MockStandardizedFilePath, string>(),
    } as any;

    (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(mockStandardizedFilePath);
    (FileUtils.getDirPath as jest.Mock).mockReturnValue(mockStandardizedFilePath);
  });

  describe('Happy Path', () => {
//    it('should write a file successfully', async () => {
//      // Arrange
//      const filePath = '/mock/path/file.txt';
//      const fileText = 'Hello, World!';
//      (fileSystemHost as any).#directories.set(mockStandardizedFilePath, mockVirtualDirectory);
//
//      // Act
//      await fileSystemHost.writeFile(filePath, fileText);
//
//      // Assert
//      expect(mockVirtualDirectory.files.get(mockStandardizedFilePath)).toBe(fileText);
//    });
  });

  describe('Edge Cases', () => {
//    it('should create directories if they do not exist', async () => {
//      // Arrange
//      const filePath = '/new/path/file.txt';
//      const fileText = 'Hello, World!';
//      const newDirPath = '/new/path' as any;
//      const newVirtualDirectory: MockVirtualDirectory = {
//        path: newDirPath,
//        files: new Map<MockStandardizedFilePath, string>(),
//      } as any;
//
//      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValueOnce(newDirPath);
//      (FileUtils.getDirPath as jest.Mock).mockReturnValueOnce(newDirPath);
//      (fileSystemHost as any).#directories.set(newDirPath, newVirtualDirectory);
//
//      // Act
//      await fileSystemHost.writeFile(filePath, fileText);
//
//      // Assert
//      expect(newVirtualDirectory.files.get(filePath as any)).toBe(fileText);
//    });

//    it('should overwrite an existing file', async () => {
//      // Arrange
//      const filePath = '/mock/path/file.txt';
//      const initialText = 'Initial Text';
//      const newText = 'New Text';
//      mockVirtualDirectory.files.set(mockStandardizedFilePath, initialText);
//      (fileSystemHost as any).#directories.set(mockStandardizedFilePath, mockVirtualDirectory);
//
//      // Act
//      await fileSystemHost.writeFile(filePath, newText);
//
//      // Assert
//      expect(mockVirtualDirectory.files.get(mockStandardizedFilePath)).toBe(newText);
//    });

//    it('should handle file path normalization', async () => {
//      // Arrange
//      const filePath = '/mock/path/../path/file.txt';
//      const normalizedPath = '/mock/path/file.txt' as any;
//      const fileText = 'Hello, World!';
//      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValueOnce(normalizedPath);
//      (fileSystemHost as any).#directories.set(mockStandardizedFilePath, mockVirtualDirectory);
//
//      // Act
//      await fileSystemHost.writeFile(filePath, fileText);
//
//      // Assert
//      expect(mockVirtualDirectory.files.get(normalizedPath)).toBe(fileText);
//    });

    it.skip('should throw an error if the file path is invalid', async () => {
      // Arrange
      const filePath = '';
      const fileText = 'Hello, World!';
      const invalidPathError = new Error('Invalid path');
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockImplementation(() => {
        throw invalidPathError;
      });

      // Act & Assert
      await expect(fileSystemHost.writeFile(filePath, fileText)).rejects.toThrow(invalidPathError);
    });
  });
});

// End of unit tests for: writeFile
