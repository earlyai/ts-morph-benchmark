
// Unit tests for: queueDirectoryDelete

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

  public setIsDeleted = jest.fn();
  public getParent = jest.fn();
  public getDescendants = jest.fn().mockReturnValue([]);
  public dequeueDirDelete = jest.fn();
  public isRootDir = jest.fn().mockReturnValue(false);
}

class MockPathCasingMaintainer {
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles: boolean | undefined;
  libFolderPath: string | undefined;
}

describe('TransactionalFileSystem.queueDirectoryDelete() queueDirectoryDelete method', () => {
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
    it('should queue a directory for deletion', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);

      transactionalFileSystem.queueDirectoryDelete(dirPath);

      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(true);
      expect(mockDir.operations).toHaveLength(1);
      expect(mockDir.operations[0]).toEqual({
        kind: 'deleteDir',
        index: 0,
        dir: mockDir,
      });
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('Edge Cases', () => {
    it('should handle when directory is already deleted', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.isDeleted = true;
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);

      transactionalFileSystem.queueDirectoryDelete(dirPath);

      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(true);
      expect(mockDir.operations).toHaveLength(1);
      expect(mockDir.operations[0]).toEqual({
        kind: 'deleteDir',
        index: 0,
        dir: mockDir,
      });
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(dirPath);
    });

    it('should handle when directory is root directory', () => {
      const dirPath: StandardizedFilePath = '/' as any;
      const mockDir = new MockDirectory(dirPath);
      mockDir.isRootDir = jest.fn().mockReturnValue(true);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);

      transactionalFileSystem.queueDirectoryDelete(dirPath);

      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(true);
      expect(mockDir.operations).toHaveLength(1);
      expect(mockDir.operations[0]).toEqual({
        kind: 'deleteDir',
        index: 0,
        dir: mockDir,
      });
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(dirPath);
    });

    it('should handle when parent directory is deleted', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const parentDirPath: StandardizedFilePath = '/path/to' as any;
      const mockDir = new MockDirectory(dirPath);
      const mockParentDir = new MockDirectory(parentDirPath);
      mockParentDir.isDeleted = true;
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);

      transactionalFileSystem.queueDirectoryDelete(dirPath);

      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(true);
      expect(mockParentDir.operations).toHaveLength(1);
      expect(mockParentDir.operations[0]).toEqual({
        kind: 'deleteDir',
        index: 0,
        dir: mockDir,
      });
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(dirPath);
    });
  });
});

// End of unit tests for: queueDirectoryDelete
