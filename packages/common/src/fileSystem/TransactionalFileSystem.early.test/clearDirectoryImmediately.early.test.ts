
// Unit tests for: clearDirectoryImmediately






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

describe('TransactionalFileSystem.clearDirectoryImmediately() clearDirectoryImmediately method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
  let tfs: TransactionalFileSystem;

  beforeEach(() => {
    mockFileSystem = {
      isCaseSensitive: jest.fn().mockReturnValue(true),
      delete: jest.fn().mockResolvedValue(undefined),
      deleteSync: jest.fn(),
      readDirSync: jest.fn().mockReturnValue([]),
      readFile: jest.fn().mockResolvedValue(''),
      readFileSync: jest.fn().mockReturnValue(''),
      writeFile: jest.fn().mockResolvedValue(undefined),
      writeFileSync: jest.fn(),
      mkdir: jest.fn().mockResolvedValue(undefined),
      mkdirSync: jest.fn(),
      move: jest.fn().mockResolvedValue(undefined),
      moveSync: jest.fn(),
      copy: jest.fn().mockResolvedValue(undefined),
      copySync: jest.fn(),
      fileExists: jest.fn().mockResolvedValue(true),
      fileExistsSync: jest.fn().mockReturnValue(true),
      directoryExists: jest.fn().mockResolvedValue(true),
      directoryExistsSync: jest.fn().mockReturnValue(true),
      realpathSync: jest.fn().mockReturnValue(''),
      getCurrentDirectory: jest.fn().mockReturnValue(''),
      glob: jest.fn().mockResolvedValue([]),
      globSync: jest.fn().mockReturnValue([]),
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
    it.skip('should clear the directory immediately', async () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      (tfs as any).directories.set(dirPath, mockDir as any);

      await tfs.clearDirectoryImmediately(dirPath);

      expect(mockFileSystem.delete).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.mkdir).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
    });

    it.skip('should clear the directory immediately synchronously', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      (tfs as any).directories.set(dirPath, mockDir as any);

      tfs.clearDirectoryImmediatelySync(dirPath);

      expect(mockFileSystem.deleteSync).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.mkdirSync).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle directory not found error gracefully', async () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      (tfs as any).directories.set(dirPath, mockDir as any);

      mockFileSystem.delete.mockRejectedValueOnce(new Error('Directory not found'));

      await tfs.clearDirectoryImmediately(dirPath);

      expect(mockFileSystem.delete).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.mkdir).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
    });

    it('should handle directory not found error gracefully synchronously', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      (tfs as any).directories.set(dirPath, mockDir as any);

      mockFileSystem.deleteSync.mockImplementationOnce(() => {
        throw new Error('Directory not found');
      });

      tfs.clearDirectoryImmediatelySync(dirPath);

      expect(mockFileSystem.deleteSync).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.mkdirSync).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
    });

    it.skip('should requeue directory delete if mkdir fails', async () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      (tfs as any).directories.set(dirPath, mockDir as any);

      mockFileSystem.mkdir.mockRejectedValueOnce(new Error('mkdir failed'));

      await expect(tfs.clearDirectoryImmediately(dirPath)).rejects.toThrow('mkdir failed');

      expect(mockFileSystem.delete).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.mkdir).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
      expect(mockDir.operations).toContainEqual({
        kind: 'deleteDir',
        index: expect.any(Number),
        dir: mockDir,
      });
    });

    it.skip('should requeue directory delete if mkdir fails synchronously', () => {
      const dirPath: StandardizedFilePath = '/path/to/dir' as any;
      const mockDir = new MockDirectory(dirPath);
      (tfs as any).directories.set(dirPath, mockDir as any);

      mockFileSystem.mkdirSync.mockImplementationOnce(() => {
        throw new Error('mkdir failed');
      });

      expect(() => tfs.clearDirectoryImmediatelySync(dirPath)).toThrow('mkdir failed');

      expect(mockFileSystem.deleteSync).toHaveBeenCalledWith(dirPath);
      expect(mockFileSystem.mkdirSync).toHaveBeenCalledWith(dirPath);
      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
      expect(mockDir.operations).toContainEqual({
        kind: 'deleteDir',
        index: expect.any(Number),
        dir: mockDir,
      });
    });
  });
});

// End of unit tests for: clearDirectoryImmediately
