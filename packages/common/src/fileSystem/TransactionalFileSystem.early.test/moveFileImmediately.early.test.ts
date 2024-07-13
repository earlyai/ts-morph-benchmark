
// Unit tests for: moveFileImmediately



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
  public childDirs: any = {
    entries: jest.fn().mockReturnValue([]),
    set: jest.fn(),
    removeByValue: jest.fn(),
  };

  constructor(public path: StandardizedFilePath) {}

  public getExternalOperations = jest.fn().mockReturnValue([]);
  public isDescendantOrEqual = jest.fn().mockReturnValue(false);
  public getIsDeleted = jest.fn().mockReturnValue(this.isDeleted);
  public getWasEverDeleted = jest.fn().mockReturnValue(this.wasEverDeleted);
  public setIsDeleted = jest.fn();
  public getParent = jest.fn().mockReturnValue(this.parent);
  public setParent = jest.fn();
  public removeParent = jest.fn();
  public getAncestors = jest.fn().mockReturnValue([]);
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

describe('TransactionalFileSystem.moveFileImmediately() moveFileImmediately method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer();
    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it('should move a file immediately', async () => {
      const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
      const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
      const fileText = 'file content';

      const mockOldDir = new MockDirectory('old/path' as StandardizedFilePath);
      const mockNewDir = new MockDirectory('new/path' as StandardizedFilePath);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
        .mockReturnValueOnce(mockOldDir as any)
        .mockReturnValueOnce(mockNewDir as any);

      jest.spyOn(transactionalFileSystem as any, 'writeFile').mockResolvedValue(undefined as never);
      jest.spyOn(transactionalFileSystem as any, 'deleteFileImmediately').mockResolvedValue(undefined as never);

      await transactionalFileSystem.moveFileImmediately(oldFilePath, newFilePath, fileText);

      expect(transactionalFileSystem['writeFile']).toHaveBeenCalledWith(newFilePath, fileText);
      expect(transactionalFileSystem['deleteFileImmediately']).toHaveBeenCalledWith(oldFilePath);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the new file path is a lib file', async () => {
      const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
      const newFilePath = 'lib/path/file.txt' as StandardizedFilePath;
      const fileText = 'file content';

      jest.spyOn(transactionalFileSystem as any, 'libFileExists').mockReturnValue(true);

      await expect(transactionalFileSystem.moveFileImmediately(oldFilePath, newFilePath, fileText))
        .rejects
        .toThrow(errors.InvalidOperationError);
    });

    it('should throw an error if there are external operations on the old file path', async () => {
      const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
      const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
      const fileText = 'file content';

      const mockOldDir = new MockDirectory('old/path' as StandardizedFilePath);
      mockOldDir.getExternalOperations.mockReturnValue([{}]);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
        .mockReturnValueOnce(mockOldDir as any);

      await expect(transactionalFileSystem.moveFileImmediately(oldFilePath, newFilePath, fileText))
        .rejects
        .toThrow(errors.InvalidOperationError);
    });

    it('should throw an error if there are external operations on the new file path', async () => {
      const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
      const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
      const fileText = 'file content';

      const mockOldDir = new MockDirectory('old/path' as StandardizedFilePath);
      const mockNewDir = new MockDirectory('new/path' as StandardizedFilePath);
      mockNewDir.getExternalOperations.mockReturnValue([{}]);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
        .mockReturnValueOnce(mockOldDir as any)
        .mockReturnValueOnce(mockNewDir as any);

      await expect(transactionalFileSystem.moveFileImmediately(oldFilePath, newFilePath, fileText))
        .rejects
        .toThrow(errors.InvalidOperationError);
    });

    it.skip('should queue file delete if deleteFileImmediately fails', async () => {
      const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
      const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
      const fileText = 'file content';

      const mockOldDir = new MockDirectory('old/path' as StandardizedFilePath);
      const mockNewDir = new MockDirectory('new/path' as StandardizedFilePath);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
        .mockReturnValueOnce(mockOldDir as any)
        .mockReturnValueOnce(mockNewDir as any);

      jest.spyOn(transactionalFileSystem as any, 'writeFile').mockResolvedValue(undefined as never);
      jest.spyOn(transactionalFileSystem as any, 'deleteFileImmediately').mockRejectedValue(new Error('delete failed'));

      await expect(transactionalFileSystem.moveFileImmediately(oldFilePath, newFilePath, fileText))
        .rejects
        .toThrow('delete failed');

      expect(transactionalFileSystem['writeFile']).toHaveBeenCalledWith(newFilePath, fileText);
      expect(transactionalFileSystem['deleteFileImmediately']).toHaveBeenCalledWith(oldFilePath);
      expect(transactionalFileSystem['queueFileDelete']).toHaveBeenCalledWith(oldFilePath);
    });
  });
});

// End of unit tests for: moveFileImmediately
