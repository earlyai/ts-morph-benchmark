
// Unit tests for: moveSync

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
    getRelativePathTo: jest.fn(),
    pathJoin: jest.fn(),
    pathStartsWith: jest.fn(),
  };
});

type MockStandardizedFilePath = string;

interface MockVirtualDirectory {
  path: MockStandardizedFilePath;
  files: Map<MockStandardizedFilePath, string>;
}

describe('InMemoryFileSystemHost.moveSync() moveSync method', () => {
  let fileSystemHost: InMemoryFileSystemHost;
  let mockDirectories: Map<MockStandardizedFilePath, MockVirtualDirectory>;

  beforeEach(() => {
    mockDirectories = new Map<MockStandardizedFilePath, MockVirtualDirectory>();
    fileSystemHost = new InMemoryFileSystemHost() as any;
    (fileSystemHost as any)['#directories'] = mockDirectories;
  });

  describe('Happy Path', () => {
    it.skip('should move a file from source to destination', () => {
      const srcPath = '/src/file.txt' as MockStandardizedFilePath;
      const destPath = '/dest/file.txt' as MockStandardizedFilePath;
      const fileContent = 'file content';

      (FileUtils.getStandardizedAbsolutePath as any).mockImplementation((_, path) => path);
      (FileUtils.getDirPath as any).mockImplementation((path) => path.substring(0, path.lastIndexOf('/')));

      const srcDirPath = '/src' as MockStandardizedFilePath;
      const destDirPath = '/dest' as MockStandardizedFilePath;

      mockDirectories.set(srcDirPath, {
        path: srcDirPath,
        files: new Map([[srcPath, fileContent]]),
      });

      fileSystemHost.moveSync(srcPath as any, destPath as any);

      expect(mockDirectories.get(srcDirPath)?.files.has(srcPath)).toBe(false);
      expect(mockDirectories.get(destDirPath)?.files.get(destPath)).toBe(fileContent);
    });

    it.skip('should move a directory from source to destination', () => {
      const srcPath = '/src' as MockStandardizedFilePath;
      const destPath = '/dest' as MockStandardizedFilePath;

      (FileUtils.getStandardizedAbsolutePath as any).mockImplementation((_, path) => path);
      (FileUtils.getDirPath as any).mockImplementation((path) => path.substring(0, path.lastIndexOf('/')));
      (FileUtils.getRelativePathTo as any).mockImplementation((from, to) => to.substring(from.length + 1));
      (FileUtils.pathJoin as any).mockImplementation((...paths) => paths.join('/'));

      const srcDir: MockVirtualDirectory = {
        path: srcPath,
        files: new Map(),
      };
      const subDirPath = '/src/subdir' as MockStandardizedFilePath;
      const subDir: MockVirtualDirectory = {
        path: subDirPath,
        files: new Map(),
      };

      mockDirectories.set(srcPath, srcDir);
      mockDirectories.set(subDirPath, subDir);

      fileSystemHost.moveSync(srcPath as any, destPath as any);

      expect(mockDirectories.has(srcPath)).toBe(false);
      expect(mockDirectories.has(subDirPath)).toBe(false);
      expect(mockDirectories.has(destPath)).toBe(true);
      expect(mockDirectories.has('/dest/subdir' as MockStandardizedFilePath)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should throw an error if the source path does not exist', () => {
      const srcPath = '/nonexistent' as MockStandardizedFilePath;
      const destPath = '/dest' as MockStandardizedFilePath;

      (FileUtils.getStandardizedAbsolutePath as any).mockImplementation((_, path) => path);

      expect(() => fileSystemHost.moveSync(srcPath as any, destPath as any)).toThrow(errors.PathNotFoundError);
    });

    it.skip('should handle moving a file to an existing directory', () => {
      const srcPath = '/src/file.txt' as MockStandardizedFilePath;
      const destPath = '/dest/file.txt' as MockStandardizedFilePath;
      const fileContent = 'file content';

      (FileUtils.getStandardizedAbsolutePath as any).mockImplementation((_, path) => path);
      (FileUtils.getDirPath as any).mockImplementation((path) => path.substring(0, path.lastIndexOf('/')));

      const srcDirPath = '/src' as MockStandardizedFilePath;
      const destDirPath = '/dest' as MockStandardizedFilePath;

      mockDirectories.set(srcDirPath, {
        path: srcDirPath,
        files: new Map([[srcPath, fileContent]]),
      });
      mockDirectories.set(destDirPath, {
        path: destDirPath,
        files: new Map(),
      });

      fileSystemHost.moveSync(srcPath as any, destPath as any);

      expect(mockDirectories.get(srcDirPath)?.files.has(srcPath)).toBe(false);
      expect(mockDirectories.get(destDirPath)?.files.get(destPath)).toBe(fileContent);
    });

    it.skip('should handle moving a directory with nested files', () => {
      const srcPath = '/src' as MockStandardizedFilePath;
      const destPath = '/dest' as MockStandardizedFilePath;
      const nestedFilePath = '/src/nested/file.txt' as MockStandardizedFilePath;
      const fileContent = 'nested file content';

      (FileUtils.getStandardizedAbsolutePath as any).mockImplementation((_, path) => path);
      (FileUtils.getDirPath as any).mockImplementation((path) => path.substring(0, path.lastIndexOf('/')));
      (FileUtils.getRelativePathTo as any).mockImplementation((from, to) => to.substring(from.length + 1));
      (FileUtils.pathJoin as any).mockImplementation((...paths) => paths.join('/'));

      const srcDir: MockVirtualDirectory = {
        path: srcPath,
        files: new Map(),
      };
      const nestedDirPath = '/src/nested' as MockStandardizedFilePath;
      const nestedDir: MockVirtualDirectory = {
        path: nestedDirPath,
        files: new Map([[nestedFilePath, fileContent]]),
      };

      mockDirectories.set(srcPath, srcDir);
      mockDirectories.set(nestedDirPath, nestedDir);

      fileSystemHost.moveSync(srcPath as any, destPath as any);

      expect(mockDirectories.has(srcPath)).toBe(false);
      expect(mockDirectories.has(nestedDirPath)).toBe(false);
      expect(mockDirectories.has(destPath)).toBe(true);
      expect(mockDirectories.has('/dest/nested' as MockStandardizedFilePath)).toBe(true);
      expect(mockDirectories.get('/dest/nested' as MockStandardizedFilePath)?.files.get('/dest/nested/file.txt' as MockStandardizedFilePath)).toBe(fileContent);
    });
  });
});

// End of unit tests for: moveSync
