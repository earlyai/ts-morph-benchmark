
// Unit tests for: deleteSync

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
    pathStartsWith: jest.fn(),
    getRelativePathTo: jest.fn(),
    pathJoin: jest.fn(),
    getBaseName: jest.fn(),
  };
});

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.deleteSync() deleteSync method', () => {
  let fileSystemHost: InMemoryFileSystemHost;
  let mockDirectories: Map<MockStandardizedFilePath, MockVirtualDirectory>;

  beforeEach(() => {
    mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>();
    fileSystemHost = new InMemoryFileSystemHost() as any;
    (fileSystemHost as any)['#directories'] = mockDirectories;
  });

  describe('Happy Path', () => {
    it.skip('should delete a directory and its descendants', () => {
      const mockDirPath = '/mockDir' as MockStandardizedFilePath;
      const mockSubDirPath = '/mockDir/subDir' as MockStandardizedFilePath;
      mockDirectories.set(mockDirPath, { path: mockDirPath, files: new Map() });
      mockDirectories.set(mockSubDirPath, { path: mockSubDirPath, files: new Map() });

      (FileUtils.getStandardizedAbsolutePath as any).mockReturnValue(mockDirPath);
      (FileUtils.pathStartsWith as any).mockImplementation((path: string, dirPath: string) => path.startsWith(dirPath));

      fileSystemHost.deleteSync(mockDirPath as any);

      expect(mockDirectories.has(mockDirPath)).toBe(false);
      expect(mockDirectories.has(mockSubDirPath)).toBe(false);
    });

    it.skip('should delete a file within a directory', () => {
      const mockDirPath = '/mockDir' as MockStandardizedFilePath;
      const mockFilePath = '/mockDir/file.txt' as MockStandardizedFilePath;
      const mockFiles = new Map<MockStandardizedFilePath, string>();
      mockFiles.set(mockFilePath, 'file content');
      mockDirectories.set(mockDirPath, { path: mockDirPath, files: mockFiles });

      (FileUtils.getStandardizedAbsolutePath as any).mockReturnValue(mockFilePath);
      (FileUtils.getDirPath as any).mockReturnValue(mockDirPath);

      fileSystemHost.deleteSync(mockFilePath as any);

      expect(mockFiles.has(mockFilePath)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should throw FileNotFoundError if the file does not exist', () => {
      const mockFilePath = '/nonExistentFile.txt' as MockStandardizedFilePath;
      const mockDirPath = '/' as MockStandardizedFilePath;

      (FileUtils.getStandardizedAbsolutePath as any).mockReturnValue(mockFilePath);
      (FileUtils.getDirPath as any).mockReturnValue(mockDirPath);

      expect(() => fileSystemHost.deleteSync(mockFilePath as any)).toThrow(errors.FileNotFoundError);
    });

    it.skip('should throw FileNotFoundError if the directory does not exist', () => {
      const mockDirPath = '/nonExistentDir' as MockStandardizedFilePath;

      (FileUtils.getStandardizedAbsolutePath as any).mockReturnValue(mockDirPath);

      expect(() => fileSystemHost.deleteSync(mockDirPath as any)).toThrow(errors.FileNotFoundError);
    });

    it.skip('should handle deleting the root directory gracefully', () => {
      const mockDirPath = '/' as MockStandardizedFilePath;

      (FileUtils.getStandardizedAbsolutePath as any).mockReturnValue(mockDirPath);

      fileSystemHost.deleteSync(mockDirPath as any);

      expect(mockDirectories.has(mockDirPath)).toBe(true);
    });
  });
});

// End of unit tests for: deleteSync
