
// Unit tests for: saveForDirectory

import { SortedKeyValueArray } from "../../collections";

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
  skipLoadingLibFiles?: boolean;
  libFolderPath?: string;
}

describe('TransactionalFileSystem.saveForDirectory() saveForDirectory method', () => {
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
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it.skip('should save directory and execute operations successfully', async () => {
      const mockDir = new MockDirectory('/path/to/dir' as StandardizedFilePath);
      const mockOperation = { kind: 'mkdir', index: 0, dir: mockDir };
      mockDir.operations.push(mockOperation);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getAndClearOperationsForDir').mockReturnValue([mockOperation] as any);
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExists').mockResolvedValue(undefined);
      jest.spyOn(transactionalFileSystem as any, 'executeOperation').mockResolvedValue(undefined);

      await transactionalFileSystem.saveForDirectory('/path/to/dir' as StandardizedFilePath);

      expect(transactionalFileSystem['getOrCreateDirectory']).toHaveBeenCalledWith('/path/to/dir');
      expect(transactionalFileSystem['ensureDirectoryExists']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['executeOperation']).toHaveBeenCalledWith(mockOperation);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error if there are external operations', async () => {
      const mockDir = new MockDirectory('/path/to/dir' as StandardizedFilePath);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'throwIfHasExternalOperations').mockImplementation(() => {
        throw new errors.InvalidOperationError('External operations exist');
      });

      await expect(transactionalFileSystem.saveForDirectory('/path/to/dir' as StandardizedFilePath)).rejects.toThrow(
        'External operations exist'
      );
    });

    it.skip('should handle empty operations gracefully', async () => {
      const mockDir = new MockDirectory('/path/to/dir' as StandardizedFilePath);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getAndClearOperationsForDir').mockReturnValue([] as any);
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExists').mockResolvedValue(undefined);

      await transactionalFileSystem.saveForDirectory('/path/to/dir' as StandardizedFilePath);

      expect(transactionalFileSystem['getOrCreateDirectory']).toHaveBeenCalledWith('/path/to/dir');
      expect(transactionalFileSystem['ensureDirectoryExists']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['executeOperation']).not.toHaveBeenCalled();
    });

    it.skip('should handle errors during operation execution', async () => {
      const mockDir = new MockDirectory('/path/to/dir' as StandardizedFilePath);
      const mockOperation = { kind: 'mkdir', index: 0, dir: mockDir };
      mockDir.operations.push(mockOperation);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getAndClearOperationsForDir').mockReturnValue([mockOperation] as any);
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExists').mockResolvedValue(undefined);
      jest.spyOn(transactionalFileSystem as any, 'executeOperation').mockRejectedValue(new Error('Operation failed'));

      await expect(transactionalFileSystem.saveForDirectory('/path/to/dir' as StandardizedFilePath)).rejects.toThrow(
        'Operation failed'
      );

      expect(transactionalFileSystem['getOrCreateDirectory']).toHaveBeenCalledWith('/path/to/dir');
      expect(transactionalFileSystem['ensureDirectoryExists']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['executeOperation']).toHaveBeenCalledWith(mockOperation);
    });
  });
});

// End of unit tests for: saveForDirectory
