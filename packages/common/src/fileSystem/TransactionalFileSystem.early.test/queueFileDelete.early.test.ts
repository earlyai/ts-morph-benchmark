
// Unit tests for: queueFileDelete

import { KeyValueCache, SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";

import { errors } from "../../errors";



import { FileSystemHost } from "../FileSystemHost";


import { StandardizedFilePath } from "../StandardizedFilePath";

import { TransactionalFileSystem } from '../TransactionalFileSystem';


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

  public getExternalOperations = jest.fn().mockReturnValue([]);
  public isDescendantOrEqual = jest.fn().mockReturnValue(false);
  public isDescendant = jest.fn().mockReturnValue(false);
  public getIsDeleted = jest.fn().mockReturnValue(this.isDeleted);
  public getWasEverDeleted = jest.fn().mockReturnValue(this.wasEverDeleted);
  public setIsDeleted = jest.fn();
  public getParent = jest.fn().mockReturnValue(this.parent);
  public setParent = jest.fn();
  public removeParent = jest.fn();
  public getAncestors = jest.fn().mockReturnValue([]);
  public getAncestorsIterator = jest.fn().mockReturnValue([]);
  public getChildrenEntriesIterator = jest.fn().mockReturnValue([]);
  public getDescendants = jest.fn().mockReturnValue([]);
  public isFileQueuedForDelete = jest.fn().mockReturnValue(false);
  public dequeueFileDelete = jest.fn();
  public dequeueDirDelete = jest.fn();
  public isRootDir = jest.fn().mockReturnValue(false);
  public removeMatchingOperations = jest.fn();
}

class MockPathCasingMaintainer {
  public getPath = jest.fn().mockReturnValue('');
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles?: boolean;
  libFolderPath?: string;
}

describe('TransactionalFileSystem.queueFileDelete() queueFileDelete method', () => {
  let mockFileSystem: FileSystemHost;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockDirectories: KeyValueCache<StandardizedFilePath, MockDirectory>;
  let transactionalFileSystem: TransactionalFileSystem;

  beforeEach(() => {
    mockFileSystem = {
      isCaseSensitive: jest.fn().mockReturnValue(true),
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
    mockDirectories = new KeyValueCache<StandardizedFilePath, MockDirectory>() as any;

    transactionalFileSystem = new TransactionalFileSystem({
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    } as any);

    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer;
    (transactionalFileSystem as any).directories = mockDirectories;
  });

  describe('Happy Path', () => {
    it('should queue a file delete operation', () => {
      const filePath: StandardizedFilePath = '/path/to/file' as any;
      const mockParentDir = new MockDirectory('/path/to' as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);

      transactionalFileSystem.queueFileDelete(filePath);

      expect(mockParentDir.operations).toHaveLength(1);
      expect(mockParentDir.operations[0]).toEqual({
        kind: 'deleteFile',
        index: 0,
        filePath,
      });
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(filePath);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the file is a lib file', () => {
      const filePath: StandardizedFilePath = '/path/to/lib/file' as any;
      jest.spyOn(transactionalFileSystem as any, 'libFileExists').mockReturnValue(true);

      expect(() => transactionalFileSystem.queueFileDelete(filePath)).toThrow(errors.InvalidOperationError);
    });

    it('should handle when parent directory is already deleted', () => {
      const filePath: StandardizedFilePath = '/path/to/file' as any;
      const mockParentDir = new MockDirectory('/path/to' as any);
      mockParentDir.getIsDeleted.mockReturnValue(true);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);

      transactionalFileSystem.queueFileDelete(filePath);

      expect(mockParentDir.operations).toHaveLength(1);
      expect(mockParentDir.operations[0]).toEqual({
        kind: 'deleteFile',
        index: 0,
        filePath,
      });
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(filePath);
    });
  });
});

// End of unit tests for: queueFileDelete
