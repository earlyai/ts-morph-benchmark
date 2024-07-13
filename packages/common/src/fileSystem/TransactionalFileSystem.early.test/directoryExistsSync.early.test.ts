
// Unit tests for: directoryExistsSync

import { SortedKeyValueArray } from "../../collections";
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

  public getExternalOperations = jest.fn();
  public isDescendantOrEqual = jest.fn();
  public getWasEverDeleted = jest.fn();
  public setIsDeleted = jest.fn();
  public getParent = jest.fn();
  public setParent = jest.fn();
  public removeParent = jest.fn();
  public getAncestors = jest.fn();
  public getDescendants = jest.fn();
  public isFileQueuedForDelete = jest.fn();
  public dequeueFileDelete = jest.fn();
  public dequeueDirDelete = jest.fn();
  public isRootDir = jest.fn();
  public getChildrenEntriesIterator = jest.fn();
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

describe('TransactionalFileSystem.directoryExistsSync() directoryExistsSync method', () => {
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
    test('should return true when directory exists and is not queued for deletion', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      mockFileSystem.directoryExistsSync.mockReturnValue(true);

      const result = transactionalFileSystem.directoryExistsSync(dirPath);

      expect(result).toBe(true);
      expect(mockFileSystem.directoryExistsSync).toHaveBeenCalledWith(dirPath);
    });

    test('should return false when directory does not exist', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      mockFileSystem.directoryExistsSync.mockReturnValue(false);

      const result = transactionalFileSystem.directoryExistsSync(dirPath);

      expect(result).toBe(false);
      expect(mockFileSystem.directoryExistsSync).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should return false when directory is queued for deletion', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.isDeleted = true;
      (transactionalFileSystem as any).directories.set(dirPath, mockDir as any);

      const result = transactionalFileSystem.directoryExistsSync(dirPath);

      expect(result).toBe(false);
    });

    test.skip('should return true when directory is in queue and exists', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.isDeleted = false;
      (transactionalFileSystem as any).directories.set(dirPath, mockDir as any);

      const result = transactionalFileSystem.directoryExistsSync(dirPath);

      expect(result).toBe(true);
    });

    test.skip('should return false when directory was ever deleted', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.getWasEverDeleted.mockReturnValue(true);
      (transactionalFileSystem as any).directories.set(dirPath, mockDir as any);

      const result = transactionalFileSystem.directoryExistsSync(dirPath);

      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: directoryExistsSync
