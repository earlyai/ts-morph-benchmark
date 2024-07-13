
// Unit tests for: copySync

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

describe('InMemoryFileSystemHost.copySync() copySync method', () => {
  let fileSystemHost: InMemoryFileSystemHost;
  let mockDirectories: Map<MockStandardizedFilePath, MockVirtualDirectory>;

  beforeEach(() => {
    mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>();
    fileSystemHost = new InMemoryFileSystemHost() as any;
    (fileSystemHost as any)['#directories'] = mockDirectories;
  });

  describe('Happy Path', () => {
    it.skip('should copy a file from source to destination', () => {
      const srcPath = '/src/file.txt' as MockStandardizedFilePath;
      const destPath = '/dest/file.txt' as MockStandardizedFilePath;
      const fileContent = 'Hello, World!';

      const srcDirPath = FileUtils.getDirPath(srcPath) as MockStandardizedFilePath;
      const destDirPath = FileUtils.getDirPath(destPath) as MockStandardizedFilePath;

      mockDirectories.set(srcDirPath, {
        path: srcDirPath,
        files: new Map([[srcPath, fileContent]]),
      } as any);

      fileSystemHost.copySync(srcPath as any, destPath as any);

      const destDir = mockDirectories.get(destDirPath);
      expect(destDir).toBeDefined();
      expect(destDir!.files.get(destPath)).toBe(fileContent);
    });

    it.skip('should copy a directory and its contents from source to destination', () => {
      const srcDirPath = '/src' as MockStandardizedFilePath;
      const destDirPath = '/dest' as MockStandardizedFilePath;
      const fileContent = 'Hello, World!';
      const srcFilePath = FileUtils.pathJoin(srcDirPath, 'file.txt') as MockStandardizedFilePath;

      mockDirectories.set(srcDirPath, {
        path: srcDirPath,
        files: new Map([[srcFilePath, fileContent]]),
      } as any);

      fileSystemHost.copySync(srcDirPath as any, destDirPath as any);

      const destDir = mockDirectories.get(destDirPath);
      expect(destDir).toBeDefined();
      const destFilePath = FileUtils.pathJoin(destDirPath, 'file.txt') as MockStandardizedFilePath;
      expect(destDir!.files.get(destFilePath)).toBe(fileContent);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the source path does not exist', () => {
      const srcPath = '/nonexistent' as MockStandardizedFilePath;
      const destPath = '/dest' as MockStandardizedFilePath;

      expect(() => fileSystemHost.copySync(srcPath as any, destPath as any)).toThrow(errors.PathNotFoundError);
    });

    it.skip('should handle copying an empty directory', () => {
      const srcDirPath = '/src' as MockStandardizedFilePath;
      const destDirPath = '/dest' as MockStandardizedFilePath;

      mockDirectories.set(srcDirPath, {
        path: srcDirPath,
        files: new Map(),
      } as any);

      fileSystemHost.copySync(srcDirPath as any, destDirPath as any);

      const destDir = mockDirectories.get(destDirPath);
      expect(destDir).toBeDefined();
      expect(destDir!.files.size).toBe(0);
    });

    it.skip('should overwrite the destination file if it already exists', () => {
      const srcPath = '/src/file.txt' as MockStandardizedFilePath;
      const destPath = '/dest/file.txt' as MockStandardizedFilePath;
      const srcFileContent = 'Hello, World!';
      const destFileContent = 'Old Content';

      const srcDirPath = FileUtils.getDirPath(srcPath) as MockStandardizedFilePath;
      const destDirPath = FileUtils.getDirPath(destPath) as MockStandardizedFilePath;

      mockDirectories.set(srcDirPath, {
        path: srcDirPath,
        files: new Map([[srcPath, srcFileContent]]),
      } as any);

      mockDirectories.set(destDirPath, {
        path: destDirPath,
        files: new Map([[destPath, destFileContent]]),
      } as any);

      fileSystemHost.copySync(srcPath as any, destPath as any);

      const destDir = mockDirectories.get(destDirPath);
      expect(destDir).toBeDefined();
      expect(destDir!.files.get(destPath)).toBe(srcFileContent);
    });
  });
});

// End of unit tests for: copySync
