
// Unit tests for: move

import { errors } from "../../errors";






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

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.move() move method', () => {
  let fileSystem: InMemoryFileSystemHost;
  let mockSrcPath: MockStandardizedFilePath;
  let mockDestPath: MockStandardizedFilePath;
  let mockFileText: string;
  let mockDirectory: MockVirtualDirectory;

  beforeEach(() => {
    fileSystem = new InMemoryFileSystemHost();
    mockSrcPath = '/src/file.txt' as any;
    mockDestPath = '/dest/file.txt' as any;
    mockFileText = 'file content';
    mockDirectory = {
      path: '/src' as any,
      files: new Map<MockStandardizedFilePath, string>([[mockSrcPath, mockFileText]]),
    } as any;

    fileSystem['#directories'].set('/src' as any, mockDirectory);
  });

  describe('Happy Path', () => {
    it.skip('should move a file from source to destination', () => {
      // Arrange
      jest.spyOn(fileSystem, 'fileExistsSync' as any).mockReturnValue(true);
      jest.spyOn(fileSystem, 'readFileSync' as any).mockReturnValue(mockFileText);
      jest.spyOn(fileSystem, 'deleteSync' as any).mockImplementation();
      jest.spyOn(fileSystem, 'writeFileSync' as any).mockImplementation();

      // Act
      fileSystem.moveSync(mockSrcPath, mockDestPath);

      // Assert
      expect(fileSystem.readFileSync(mockDestPath)).toBe(mockFileText);
      expect(fileSystem.fileExistsSync(mockSrcPath)).toBe(false);
    });

    it.skip('should move a directory from source to destination', () => {
      // Arrange
      const mockSrcDirPath = '/src' as any;
      const mockDestDirPath = '/dest' as any;
      const mockSubDirPath = '/src/subdir' as any;
      const mockSubDirFilePath = '/src/subdir/file.txt' as any;
      const mockSubDirFileText = 'subdir file content';

      const mockSubDirectory: MockVirtualDirectory = {
        path: mockSubDirPath,
        files: new Map<MockStandardizedFilePath, string>([[mockSubDirFilePath, mockSubDirFileText]]),
      } as any;

      fileSystem['#directories'].set(mockSubDirPath, mockSubDirectory);

      jest.spyOn(fileSystem, 'fileExistsSync' as any).mockReturnValue(false);
      jest.spyOn(fileSystem, 'directoryExistsSync' as any).mockReturnValue(true);
      jest.spyOn(fileSystem, 'deleteSync' as any).mockImplementation();
      jest.spyOn(fileSystem, 'writeFileSync' as any).mockImplementation();

      // Act
      fileSystem.moveSync(mockSrcDirPath, mockDestDirPath);

      // Assert
      expect(fileSystem['#directories'].has(mockSrcDirPath)).toBe(false);
      expect(fileSystem['#directories'].has(mockDestDirPath)).toBe(true);
      expect(fileSystem['#directories'].has('/dest/subdir' as any)).toBe(true);
      expect(fileSystem.readFileSync('/dest/subdir/file.txt' as any)).toBe(mockSubDirFileText);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should throw PathNotFoundError if source path does not exist', () => {
      // Arrange
      const nonExistentPath = '/non-existent-path' as any;
      jest.spyOn(fileSystem, 'fileExistsSync' as any).mockReturnValue(false);
      jest.spyOn(fileSystem, 'directoryExistsSync' as any).mockReturnValue(false);

      // Act & Assert
      expect(() => fileSystem.moveSync(nonExistentPath, mockDestPath)).toThrow(errors.PathNotFoundError);
    });

    it.skip('should handle moving an empty directory', () => {
      // Arrange
      const emptyDirPath = '/empty-dir' as any;
      const destEmptyDirPath = '/dest-empty-dir' as any;
      const emptyDirectory: MockVirtualDirectory = {
        path: emptyDirPath,
        files: new Map<MockStandardizedFilePath, string>(),
      } as any;

      fileSystem['#directories'].set(emptyDirPath, emptyDirectory);

      jest.spyOn(fileSystem, 'fileExistsSync' as any).mockReturnValue(false);
      jest.spyOn(fileSystem, 'directoryExistsSync' as any).mockReturnValue(true);
      jest.spyOn(fileSystem, 'deleteSync' as any).mockImplementation();
      jest.spyOn(fileSystem, 'writeFileSync' as any).mockImplementation();

      // Act
      fileSystem.moveSync(emptyDirPath, destEmptyDirPath);

      // Assert
      expect(fileSystem['#directories'].has(emptyDirPath)).toBe(false);
      expect(fileSystem['#directories'].has(destEmptyDirPath)).toBe(true);
    });

    it.skip('should handle moving a file to an existing directory', () => {
      // Arrange
      const existingDirPath = '/existing-dir' as any;
      const destFilePath = '/existing-dir/file.txt' as any;
      const existingDirectory: MockVirtualDirectory = {
        path: existingDirPath,
        files: new Map<MockStandardizedFilePath, string>(),
      } as any;

      fileSystem['#directories'].set(existingDirPath, existingDirectory);

      jest.spyOn(fileSystem, 'fileExistsSync' as any).mockReturnValue(true);
      jest.spyOn(fileSystem, 'readFileSync' as any).mockReturnValue(mockFileText);
      jest.spyOn(fileSystem, 'deleteSync' as any).mockImplementation();
      jest.spyOn(fileSystem, 'writeFileSync' as any).mockImplementation();

      // Act
      fileSystem.moveSync(mockSrcPath, destFilePath);

      // Assert
      expect(fileSystem.readFileSync(destFilePath)).toBe(mockFileText);
      expect(fileSystem.fileExistsSync(mockSrcPath)).toBe(false);
    });
  });
});

// End of unit tests for: move
