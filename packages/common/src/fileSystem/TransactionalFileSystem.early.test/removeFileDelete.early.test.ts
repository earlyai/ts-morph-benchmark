
// Unit tests for: removeFileDelete

import { KeyValueCache, SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";




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

  public dequeueFileDelete = jest.fn();
  public getWasEverDeleted = jest.fn().mockReturnValue(false);
  public setIsDeleted = jest.fn();
  public getParent = jest.fn().mockReturnValue(undefined);
  public removeParent = jest.fn();
  public getDescendants = jest.fn().mockReturnValue([]);
  public isFileQueuedForDelete = jest.fn().mockReturnValue(false);
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

describe('TransactionalFileSystem.removeFileDelete() removeFileDelete method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockDirectories: jest.Mocked<KeyValueCache<StandardizedFilePath, MockDirectory>>;
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
    mockDirectories = {
      get: jest.fn(),
      getOrCreate: jest.fn(),
      has: jest.fn(),
      removeByKey: jest.fn(),
      clear: jest.fn(),
      getValues: jest.fn(),
    } as any;

    transactionalFileSystem = new TransactionalFileSystem({
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    } as any);

    (transactionalFileSystem as any).directories = mockDirectories;
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer;
  });

  describe('Happy Path', () => {
    test.skip('should remove file delete operation from the parent directory', () => {
      const filePath: StandardizedFilePath = '/path/to/file' as any;
      const mockParentDirectory = new MockDirectory('/path/to' as any);
      mockDirectories.getOrCreate.mockReturnValue(mockParentDirectory as any);

      transactionalFileSystem.removeFileDelete(filePath);

      expect(mockDirectories.getOrCreate).toHaveBeenCalledWith('/path/to' as any);
      expect(mockParentDirectory.dequeueFileDelete).toHaveBeenCalledWith(filePath);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should handle case where parent directory does not exist', () => {
      const filePath: StandardizedFilePath = '/path/to/nonexistent/file' as any;
      const mockParentDirectory = new MockDirectory('/path/to/nonexistent' as any);
      mockDirectories.getOrCreate.mockReturnValue(mockParentDirectory as any);

      transactionalFileSystem.removeFileDelete(filePath);

      expect(mockDirectories.getOrCreate).toHaveBeenCalledWith('/path/to/nonexistent' as any);
      expect(mockParentDirectory.dequeueFileDelete).toHaveBeenCalledWith(filePath);
    });

    test.skip('should handle case where file is not queued for deletion', () => {
      const filePath: StandardizedFilePath = '/path/to/file' as any;
      const mockParentDirectory = new MockDirectory('/path/to' as any);
      mockParentDirectory.isFileQueuedForDelete.mockReturnValue(false);
      mockDirectories.getOrCreate.mockReturnValue(mockParentDirectory as any);

      transactionalFileSystem.removeFileDelete(filePath);

      expect(mockDirectories.getOrCreate).toHaveBeenCalledWith('/path/to' as any);
      expect(mockParentDirectory.dequeueFileDelete).toHaveBeenCalledWith(filePath);
    });
  });
});

// End of unit tests for: removeFileDelete
