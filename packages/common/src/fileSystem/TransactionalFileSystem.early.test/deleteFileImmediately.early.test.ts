
// Unit tests for: deleteFileImmediately

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

describe('TransactionalFileSystem.deleteFileImmediately() deleteFileImmediately method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
  let tfs: TransactionalFileSystem;

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

    tfs = new TransactionalFileSystem(mockOptions as any);
    (tfs as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it('should delete a file immediately when no external operations exist', async () => {
      const filePath = 'some/file/path' as StandardizedFilePath;
      const mockDir = new MockDirectory('some/file' as StandardizedFilePath);
      jest.spyOn(tfs as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(tfs as any, 'deleteSuppressNotFound').mockResolvedValue(undefined);

      await tfs.deleteFileImmediately(filePath);

      expect(mockDir.dequeueFileDelete).toHaveBeenCalledWith(filePath);
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(filePath);
      expect(tfs['deleteSuppressNotFound']).toHaveBeenCalledWith(filePath);
    });

    it('should delete a file immediately synchronously when no external operations exist', () => {
      const filePath = 'some/file/path' as StandardizedFilePath;
      const mockDir = new MockDirectory('some/file' as StandardizedFilePath);
      jest.spyOn(tfs as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(tfs as any, 'deleteSuppressNotFoundSync').mockReturnValue(undefined);

      tfs.deleteFileImmediatelySync(filePath);

      expect(mockDir.dequeueFileDelete).toHaveBeenCalledWith(filePath);
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(filePath);
      expect(tfs['deleteSuppressNotFoundSync']).toHaveBeenCalledWith(filePath);
    });
  });

  describe('Edge Cases', () => {
    it('should queue file delete if delete operation fails', async () => {
      const filePath = 'some/file/path' as StandardizedFilePath;
      const mockDir = new MockDirectory('some/file' as StandardizedFilePath);
      jest.spyOn(tfs as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(tfs as any, 'deleteSuppressNotFound').mockRejectedValue(new Error('Delete failed'));

      await expect(tfs.deleteFileImmediately(filePath)).rejects.toThrow('Delete failed');

      expect(mockDir.dequeueFileDelete).toHaveBeenCalledWith(filePath);
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(filePath);
      expect(tfs['deleteSuppressNotFound']).toHaveBeenCalledWith(filePath);
      expect(mockDir.operations).toContainEqual({
        kind: 'deleteFile',
        index: expect.any(Number),
        filePath,
      });
    });

    it('should queue file delete if delete operation fails synchronously', () => {
      const filePath = 'some/file/path' as StandardizedFilePath;
      const mockDir = new MockDirectory('some/file' as StandardizedFilePath);
      jest.spyOn(tfs as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(tfs as any, 'deleteSuppressNotFoundSync').mockImplementation(() => {
        throw new Error('Delete failed');
      });

      expect(() => tfs.deleteFileImmediatelySync(filePath)).toThrow('Delete failed');

      expect(mockDir.dequeueFileDelete).toHaveBeenCalledWith(filePath);
      expect(mockPathCasingMaintainer.removePath).toHaveBeenCalledWith(filePath);
      expect(tfs['deleteSuppressNotFoundSync']).toHaveBeenCalledWith(filePath);
      expect(mockDir.operations).toContainEqual({
        kind: 'deleteFile',
        index: expect.any(Number),
        filePath,
      });
    });

    it('should throw an error if the file is a lib file', async () => {
      const filePath = 'lib/file/path' as StandardizedFilePath;
      jest.spyOn(tfs as any, 'libFileExists').mockReturnValue(true);

      await expect(tfs.deleteFileImmediately(filePath)).rejects.toThrow(errors.InvalidOperationError);

      expect(tfs['libFileExists']).toHaveBeenCalledWith(filePath);
    });

    it('should throw an error if the file is a lib file synchronously', () => {
      const filePath = 'lib/file/path' as StandardizedFilePath;
      jest.spyOn(tfs as any, 'libFileExists').mockReturnValue(true);

      expect(() => tfs.deleteFileImmediatelySync(filePath)).toThrow(errors.InvalidOperationError);

      expect(tfs['libFileExists']).toHaveBeenCalledWith(filePath);
    });

    it('should throw an error if there are external operations', async () => {
      const filePath = 'some/file/path' as StandardizedFilePath;
      const mockDir = new MockDirectory('some/file' as StandardizedFilePath);
      jest.spyOn(tfs as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(mockDir, 'getExternalOperations').mockReturnValue([{}]);

      await expect(tfs.deleteFileImmediately(filePath)).rejects.toThrow(errors.InvalidOperationError);

      expect(mockDir.getExternalOperations).toHaveBeenCalled();
    });

    it('should throw an error if there are external operations synchronously', () => {
      const filePath = 'some/file/path' as StandardizedFilePath;
      const mockDir = new MockDirectory('some/file' as StandardizedFilePath);
      jest.spyOn(tfs as any, 'getOrCreateParentDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(mockDir, 'getExternalOperations').mockReturnValue([{}]);

      expect(() => tfs.deleteFileImmediatelySync(filePath)).toThrow(errors.InvalidOperationError);

      expect(mockDir.getExternalOperations).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: deleteFileImmediately
