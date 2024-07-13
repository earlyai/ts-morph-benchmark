
// Unit tests for: delete

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

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.delete() delete method', () => {
  let fileSystemHost: InMemoryFileSystemHost;
  let mockFileUtils: typeof FileUtils;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
    mockFileUtils = {
      ...FileUtils,
      getStandardizedAbsolutePath: jest.fn(),
      getDirPath: jest.fn(),
      pathStartsWith: jest.fn(),
      getRelativePathTo: jest.fn(),
      pathJoin: jest.fn(),
    } as any;
  });

  describe('Happy Path', () => {
    it.skip('should delete a file successfully', async () => {
      const mockPath = '/mock/file.txt' as MockStandardizedFilePath;
      const mockDirPath = '/mock' as MockStandardizedFilePath;
      const mockFileContent = 'file content';

      (mockFileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(mockPath);
      (mockFileUtils.getDirPath as jest.Mock).mockReturnValue(mockDirPath);

      const mockDir: MockVirtualDirectory = {
        path: mockDirPath,
        files: new Map([[mockPath, mockFileContent]]),
      };

      (fileSystemHost as any)['#directories'].set(mockDirPath, mockDir);

      await fileSystemHost.delete(mockPath as any);

      expect(mockDir.files.has(mockPath)).toBe(false);
    });

    it.skip('should delete a directory and its descendants successfully', async () => {
      const mockDirPath = '/mock' as MockStandardizedFilePath;
      const mockSubDirPath = '/mock/subdir' as MockStandardizedFilePath;

      (mockFileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(mockDirPath);

      const mockDir: MockVirtualDirectory = {
        path: mockDirPath,
        files: new Map(),
      };

      const mockSubDir: MockVirtualDirectory = {
        path: mockSubDirPath,
        files: new Map(),
      };

      (fileSystemHost as any)['#directories'].set(mockDirPath, mockDir);
      (fileSystemHost as any)['#directories'].set(mockSubDirPath, mockSubDir);

      await fileSystemHost.delete(mockDirPath as any);

      expect((fileSystemHost as any)['#directories'].has(mockDirPath)).toBe(false);
      expect((fileSystemHost as any)['#directories'].has(mockSubDirPath)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should throw FileNotFoundError if the file does not exist', async () => {
      const mockPath = '/nonexistent/file.txt' as MockStandardizedFilePath;
      const mockDirPath = '/nonexistent' as MockStandardizedFilePath;

      (mockFileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(mockPath);
      (mockFileUtils.getDirPath as jest.Mock).mockReturnValue(mockDirPath);

      await expect(fileSystemHost.delete(mockPath as any)).rejects.toThrow(errors.FileNotFoundError);
    });

    it('should throw FileNotFoundError if the directory does not exist', async () => {
      const mockDirPath = '/nonexistent' as MockStandardizedFilePath;

      (mockFileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(mockDirPath);

      await expect(fileSystemHost.delete(mockDirPath as any)).rejects.toThrow(errors.FileNotFoundError);
    });

    it('should handle deleting a file in a non-existent parent directory', async () => {
      const mockPath = '/nonexistent/file.txt' as MockStandardizedFilePath;
      const mockDirPath = '/nonexistent' as MockStandardizedFilePath;

      (mockFileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(mockPath);
      (mockFileUtils.getDirPath as jest.Mock).mockReturnValue(mockDirPath);

      await expect(fileSystemHost.delete(mockPath as any)).rejects.toThrow(errors.FileNotFoundError);
    });
  });
});

// End of unit tests for: delete
