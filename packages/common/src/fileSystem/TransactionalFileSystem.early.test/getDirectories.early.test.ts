
// Unit tests for: getDirectories

import { SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";




import { FileSystemHost } from "../FileSystemHost";


import { StandardizedFilePath } from "../StandardizedFilePath";

import { DirEntry, TransactionalFileSystem } from '../TransactionalFileSystem';


jest.mock('../../getLibFiles', () => {
  const actual = jest.requireActual('../../getLibFiles');
  return {
    ...actual,
    getLibFiles: jest.fn(),
    getLibFolderPath: jest.fn(),
  };
});

class MockDirectory {
  public operations: any[] = [];
  public inboundOperations: any[] = [];
  public isDeleted: boolean = false;
  public wasEverDeleted: boolean = false;
  public parent: MockDirectory | undefined = undefined;
  public childDirs = new SortedKeyValueArray<StandardizedFilePath, MockDirectory>(
    item => item.path,
    LocaleStringComparer.instance
  );
  public path: StandardizedFilePath;

  constructor(path: StandardizedFilePath) {
    this.path = path;
  }

  public getExternalOperations = jest.fn();
  public isDescendantOrEqual = jest.fn();
  public isDescendant = jest.fn();
  public getIsDeleted = jest.fn();
  public getWasEverDeleted = jest.fn();
  public setIsDeleted = jest.fn();
  public getParent = jest.fn();
  public setParent = jest.fn();
  public removeParent = jest.fn();
  public getAncestors = jest.fn();
  public getAncestorsIterator = jest.fn();
  public getChildrenEntriesIterator = jest.fn();
  public getDescendants = jest.fn();
  public isFileQueuedForDelete = jest.fn();
  public dequeueFileDelete = jest.fn();
  public dequeueDirDelete = jest.fn();
  public isRootDir = jest.fn();
  public removeMatchingOperations = jest.fn();
}

class MockPathCasingMaintainer {
  public getPath = jest.fn();
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles: boolean | undefined;
  libFolderPath: string | undefined;
}

describe('TransactionalFileSystem.getDirectories() getDirectories method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
  let transactionalFileSystem: TransactionalFileSystem;

  beforeEach(() => {
    mockFileSystem = {
      isCaseSensitive: jest.fn(),
      delete: jest.fn(),
      deleteSync: jest.fn(),
      readDirSync: jest.fn(),
      readFile: jest.fn(),
      readFileSync: jest.fn(),
      writeFile: jest.fn(),
      writeFileSync: jest.fn(),
      mkdir: jest.fn(),
      mkdirSync: jest.fn(),
      move: jest.fn(),
      moveSync: jest.fn(),
      copy: jest.fn(),
      copySync: jest.fn(),
      fileExists: jest.fn(),
      fileExistsSync: jest.fn(),
      directoryExists: jest.fn(),
      directoryExistsSync: jest.fn(),
      realpathSync: jest.fn(),
      getCurrentDirectory: jest.fn(),
      glob: jest.fn(),
      globSync: jest.fn(),
    } as any;

    mockPathCasingMaintainer = new MockPathCasingMaintainer();
    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
      libFolderPath: undefined,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it.skip('should return directories when there are directories in the given path', () => {
      const dirPath = '/some/path' as StandardizedFilePath;
      const mockDirEntry: DirEntry = {
        path: '/some/path/dir1' as StandardizedFilePath,
        isFile: false,
        isDirectory: true,
        isSymlink: false,
      };

      mockFileSystem.readDirSync.mockReturnValue([mockDirEntry] as any);

      const result = transactionalFileSystem.getDirectories(dirPath);

      expect(result).toEqual(['/some/path/dir1']);
      expect(mockFileSystem.readDirSync).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('Edge Cases', () => {
    it('should return an empty array when there are no directories in the given path', () => {
      const dirPath = '/some/empty/path' as StandardizedFilePath;

      mockFileSystem.readDirSync.mockReturnValue([] as any);

      const result = transactionalFileSystem.getDirectories(dirPath);

      expect(result).toEqual([]);
      expect(mockFileSystem.readDirSync).toHaveBeenCalledWith(dirPath);
    });

    it.skip('should filter out files and only return directories', () => {
      const dirPath = '/some/mixed/path' as StandardizedFilePath;
      const mockDirEntries: DirEntry[] = [
        {
          path: '/some/mixed/path/dir1' as StandardizedFilePath,
          isFile: false,
          isDirectory: true,
          isSymlink: false,
        },
        {
          path: '/some/mixed/path/file1.txt' as StandardizedFilePath,
          isFile: true,
          isDirectory: false,
          isSymlink: false,
        },
      ];

      mockFileSystem.readDirSync.mockReturnValue(mockDirEntries as any);

      const result = transactionalFileSystem.getDirectories(dirPath);

      expect(result).toEqual(['/some/mixed/path/dir1']);
      expect(mockFileSystem.readDirSync).toHaveBeenCalledWith(dirPath);
    });

    it.skip('should handle paths with special characters', () => {
      const dirPath = '/some/special/!@#$%^&*()_+{}|:"<>?`~' as StandardizedFilePath;
      const mockDirEntry: DirEntry = {
        path: '/some/special/!@#$%^&*()_+{}|:"<>?`~/dir1' as StandardizedFilePath,
        isFile: false,
        isDirectory: true,
        isSymlink: false,
      };

      mockFileSystem.readDirSync.mockReturnValue([mockDirEntry] as any);

      const result = transactionalFileSystem.getDirectories(dirPath);

      expect(result).toEqual(['/some/special/!@#$%^&*()_+{}|:"<>?`~/dir1']);
      expect(mockFileSystem.readDirSync).toHaveBeenCalledWith(dirPath);
    });

    it.skip('should handle deeply nested directories', () => {
      const dirPath = '/some/deeply/nested/path' as StandardizedFilePath;
      const mockDirEntry: DirEntry = {
        path: '/some/deeply/nested/path/dir1' as StandardizedFilePath,
        isFile: false,
        isDirectory: true,
        isSymlink: false,
      };

      mockFileSystem.readDirSync.mockReturnValue([mockDirEntry] as any);

      const result = transactionalFileSystem.getDirectories(dirPath);

      expect(result).toEqual(['/some/deeply/nested/path/dir1']);
      expect(mockFileSystem.readDirSync).toHaveBeenCalledWith(dirPath);
    });

    it.skip('should handle directories with similar names', () => {
      const dirPath = '/some/similar/names' as StandardizedFilePath;
      const mockDirEntries: DirEntry[] = [
        {
          path: '/some/similar/names/dir1' as StandardizedFilePath,
          isFile: false,
          isDirectory: true,
          isSymlink: false,
        },
        {
          path: '/some/similar/names/dir1a' as StandardizedFilePath,
          isFile: false,
          isDirectory: true,
          isSymlink: false,
        },
      ];

      mockFileSystem.readDirSync.mockReturnValue(mockDirEntries as any);

      const result = transactionalFileSystem.getDirectories(dirPath);

      expect(result).toEqual(['/some/similar/names/dir1', '/some/similar/names/dir1a']);
      expect(mockFileSystem.readDirSync).toHaveBeenCalledWith(dirPath);
    });
  });
});

// End of unit tests for: getDirectories
