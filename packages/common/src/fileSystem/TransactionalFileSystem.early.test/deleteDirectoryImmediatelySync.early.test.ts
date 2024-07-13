
// Unit tests for: deleteDirectoryImmediatelySync

import { SortedKeyValueArray } from "../../collections";
import { LocaleStringComparer } from "../../comparers";
import { errors } from "../../errors";
import { FileSystemHost } from "../FileSystemHost";
import { StandardizedFilePath } from "../StandardizedFilePath";
import { TransactionalFileSystem } from "../TransactionalFileSystem";


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

describe('TransactionalFileSystem.deleteDirectoryImmediatelySync() deleteDirectoryImmediatelySync method', () => {
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
    it.skip('should delete a directory immediately when no external operations exist', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.getExternalOperations.mockReturnValue([]);
      (transactionalFileSystem as any).directories.set(dirPath, mockDir as any);

      transactionalFileSystem.deleteDirectoryImmediatelySync(dirPath);

      expect(mockDir.getExternalOperations).toHaveBeenCalled();
      expect(mockDir.removeParent).toHaveBeenCalled();
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.deleteSync).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle directory not found error gracefully', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.getExternalOperations.mockReturnValue([]);
      (transactionalFileSystem as any).directories.set(dirPath, mockDir as any);
      mockFileSystem.deleteSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });

      transactionalFileSystem.deleteDirectoryImmediatelySync(dirPath);

      expect(mockDir.getExternalOperations).toHaveBeenCalled();
      expect(mockDir.removeParent).toHaveBeenCalled();
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.deleteSync).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setParent).not.toHaveBeenCalled();
    });

    it.skip('should queue directory delete if an error occurs during deletion', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.getExternalOperations.mockReturnValue([]);
      (transactionalFileSystem as any).directories.set(dirPath, mockDir as any);
      mockFileSystem.deleteSync.mockImplementation(() => {
        throw new Error('Some error');
      });

      transactionalFileSystem.deleteDirectoryImmediatelySync(dirPath);

      expect(mockDir.getExternalOperations).toHaveBeenCalled();
      expect(mockDir.removeParent).toHaveBeenCalled();
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.deleteSync).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setParent).toHaveBeenCalled();
    });

    it.skip('should throw an error if there are external operations', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.getExternalOperations.mockReturnValue([{ kind: 'move' }]);
      (transactionalFileSystem as any).directories.set(dirPath, mockDir as any);

      expect(() => {
        transactionalFileSystem.deleteDirectoryImmediatelySync(dirPath);
      }).toThrow(errors.InvalidOperationError);

      expect(mockDir.getExternalOperations).toHaveBeenCalled();
      expect(mockDir.removeParent).not.toHaveBeenCalled();
      expect(mockPathCasingMaintainer.removePath).not.toHaveBeenCalled();
      expect(mockFileSystem.deleteSync).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: deleteDirectoryImmediatelySync
