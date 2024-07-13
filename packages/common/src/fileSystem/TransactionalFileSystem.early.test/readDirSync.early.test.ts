
// Unit tests for: readDirSync

import { SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";

import { errors } from "../../errors";



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
    (item: any) => item.path,
    LocaleStringComparer.instance
  );

  constructor(public path: StandardizedFilePath) {}

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

describe('TransactionalFileSystem.readDirSync() readDirSync method', () => {
  let mockFileSystemHost: FileSystemHost;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
  let transactionalFileSystem: TransactionalFileSystem;

  beforeEach(() => {
    mockFileSystemHost = {
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer() as any;

    mockOptions = {
      fileSystem: mockFileSystemHost,
      skipLoadingLibFiles: true,
      libFolderPath: undefined,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it('should read directory contents correctly', () => {
      const dirPath = '/some/path' as StandardizedFilePath;
      const mockDir = new MockDirectory(dirPath) as any;
      const mockDirEntry: DirEntry = {
        path: '/some/path/file.txt' as StandardizedFilePath,
        isFile: true,
        isDirectory: false,
        isSymlink: false,
      };

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir);
      jest.spyOn(mockDir, 'getChildrenEntriesIterator').mockReturnValue([mockDirEntry]);
      jest.spyOn(mockFileSystemHost, 'readDirSync').mockReturnValue([]);

      const result = transactionalFileSystem.readDirSync(dirPath);

      expect(result).toEqual([mockDirEntry]);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error if directory is queued for deletion', () => {
      const dirPath = '/some/path' as StandardizedFilePath;
      const mockDir = new MockDirectory(dirPath) as any;
      mockDir.getIsDeleted.mockReturnValue(true);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir);

      expect(() => transactionalFileSystem.readDirSync(dirPath)).toThrow(
        new errors.InvalidOperationError(`Cannot read directory at ${dirPath} when it is queued for deletion.`)
      );
    });

    it('should throw error if an ancestor directory was once deleted or moved', () => {
      const dirPath = '/some/path' as StandardizedFilePath;
      const mockDir = new MockDirectory(dirPath) as any;
      mockDir.getIsDeleted.mockReturnValue(false);
      mockDir.getWasEverDeleted.mockReturnValue(true);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir);

      expect(() => transactionalFileSystem.readDirSync(dirPath)).toThrow(
        new errors.InvalidOperationError(`Cannot read directory at ${dirPath} because one of its ancestor directories was once deleted or moved.`)
      );
    });

    it.skip('should handle files and directories correctly', () => {
      const dirPath = '/some/path' as StandardizedFilePath;
      const mockDir = new MockDirectory(dirPath) as any;
      const mockDirEntry: DirEntry = {
        path: '/some/path/file.txt' as StandardizedFilePath,
        isFile: true,
        isDirectory: false,
        isSymlink: false,
      };
      const mockFileSystemEntry = {
        name: '/some/path/anotherFile.txt',
        isFile: true,
        isDirectory: false,
        isSymlink: false,
      };

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir);
      jest.spyOn(mockDir, 'getChildrenEntriesIterator').mockReturnValue([mockDirEntry]);
      jest.spyOn(mockFileSystemHost, 'readDirSync').mockReturnValue([mockFileSystemEntry]);
      jest.spyOn(transactionalFileSystem as any, 'getStandardizedAbsolutePath').mockReturnValue(mockFileSystemEntry.name as StandardizedFilePath);
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(false);

      const result = transactionalFileSystem.readDirSync(dirPath);

      expect(result).toEqual([
        mockDirEntry,
        {
          path: mockFileSystemEntry.name as StandardizedFilePath,
          isFile: true,
          isDirectory: false,
          isSymlink: false,
        },
      ]);
    });

    it('should not include paths queued for deletion', () => {
      const dirPath = '/some/path' as StandardizedFilePath;
      const mockDir = new MockDirectory(dirPath) as any;
      const mockFileSystemEntry = {
        name: '/some/path/anotherFile.txt',
        isFile: true,
        isDirectory: false,
        isSymlink: false,
      };

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir);
      jest.spyOn(mockDir, 'getChildrenEntriesIterator').mockReturnValue([]);
      jest.spyOn(mockFileSystemHost, 'readDirSync').mockReturnValue([mockFileSystemEntry]);
      jest.spyOn(transactionalFileSystem as any, 'getStandardizedAbsolutePath').mockReturnValue(mockFileSystemEntry.name as StandardizedFilePath);
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(true);

      const result = transactionalFileSystem.readDirSync(dirPath);

      expect(result).toEqual([]);
    });
  });
});

// End of unit tests for: readDirSync
