
// Unit tests for: readFile

import { errors } from "../../errors";



import { FileUtils } from "../FileUtils";



import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


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
  };
});

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.readFile() readFile method', () => {
  let fileSystem: InMemoryFileSystemHost;
  let mockFilePath: MockStandardizedFilePath;
  let mockFileContent: string;
  let mockDirPath: MockStandardizedFilePath;
  let mockVirtualDirectory: MockVirtualDirectory;

  beforeEach(() => {
    fileSystem = new InMemoryFileSystemHost();
    mockFilePath = '/mock/path/file.txt' as MockStandardizedFilePath;
    mockFileContent = 'file content';
    mockDirPath = '/mock/path' as MockStandardizedFilePath;
    mockVirtualDirectory = {
      path: mockDirPath,
      files: new Map<MockStandardizedFilePath, string>([[mockFilePath, mockFileContent]]),
    };

    (FileUtils.getStandardizedAbsolutePath as any).mockImplementation((_, path) => path);
    (FileUtils.getDirPath as any).mockImplementation((path) => path.substring(0, path.lastIndexOf('/')));
  });

  describe('Happy path', () => {
    it.skip('should read a file successfully', async () => {
      // Arrange
      (fileSystem as any)['#directories'].set(mockDirPath, mockVirtualDirectory);

      // Act
      const result = await fileSystem.readFile(mockFilePath);

      // Assert
      expect(result).toBe(mockFileContent);
    });

    it.skip('should read a file with specified encoding successfully', async () => {
      // Arrange
      (fileSystem as any)['#directories'].set(mockDirPath, mockVirtualDirectory);

      // Act
      const result = await fileSystem.readFile(mockFilePath, 'utf-8');

      // Assert
      expect(result).toBe(mockFileContent);
    });
  });

  describe('Edge cases', () => {
    it.skip('should throw FileNotFoundError if directory does not exist', async () => {
      // Arrange
      const nonExistentFilePath = '/non/existent/file.txt' as MockStandardizedFilePath;

      // Act & Assert
      await expect(fileSystem.readFile(nonExistentFilePath)).rejects.toThrow(errors.FileNotFoundError);
    });

    it.skip('should throw FileNotFoundError if file does not exist in existing directory', async () => {
      // Arrange
      const nonExistentFilePath = '/mock/path/nonexistent.txt' as MockStandardizedFilePath;
      (fileSystem as any)['#directories'].set(mockDirPath, mockVirtualDirectory);

      // Act & Assert
      await expect(fileSystem.readFile(nonExistentFilePath)).rejects.toThrow(errors.FileNotFoundError);
    });

    it.skip('should handle empty file content', async () => {
      // Arrange
      const emptyFilePath = '/mock/path/empty.txt' as MockStandardizedFilePath;
      mockVirtualDirectory.files.set(emptyFilePath, '');
      (fileSystem as any)['#directories'].set(mockDirPath, mockVirtualDirectory);

      // Act
      const result = await fileSystem.readFile(emptyFilePath);

      // Assert
      expect(result).toBe('');
    });

    it.skip('should handle file paths with special characters', async () => {
      // Arrange
      const specialCharFilePath = '/mock/path/special!@#.txt' as MockStandardizedFilePath;
      const specialCharFileContent = 'special content';
      mockVirtualDirectory.files.set(specialCharFilePath, specialCharFileContent);
      (fileSystem as any)['#directories'].set(mockDirPath, mockVirtualDirectory);

      // Act
      const result = await fileSystem.readFile(specialCharFilePath);

      // Assert
      expect(result).toBe(specialCharFileContent);
    });
  });
});

// End of unit tests for: readFile
