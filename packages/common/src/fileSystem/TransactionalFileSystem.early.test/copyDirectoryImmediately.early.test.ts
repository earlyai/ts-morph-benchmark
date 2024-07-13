
// Unit tests for: copyDirectoryImmediately



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
  public getChildrenEntriesIterator = jest.fn().mockReturnValue([]);
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

describe('TransactionalFileSystem.copyDirectoryImmediately() copyDirectoryImmediately method', () => {
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
    it('should copy directory immediately when no external operations exist', async () => {
      const srcDirPath = '/src' as StandardizedFilePath;
      const destDirPath = '/dest' as StandardizedFilePath;
      const mockSrcDir = new MockDirectory(srcDirPath);
      const mockDestDir = new MockDirectory(destDirPath);

      jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
        if (path === srcDirPath) return mockSrcDir as any;
        if (path === destDirPath) return mockDestDir as any;
        return new MockDirectory(path) as any;
      });

      jest.spyOn(tfs as any, 'saveForDirectory').mockResolvedValue(undefined as never);
      jest.spyOn(tfs as any, 'removeDirAndSubDirs').mockImplementation();

      await tfs.copyDirectoryImmediately(srcDirPath, destDirPath);

      expect(tfs.saveForDirectory).toHaveBeenCalledWith(srcDirPath);
      expect(tfs.saveForDirectory).toHaveBeenCalledWith(destDirPath);
//      expect(tfs.removeDirAndSubDirs).toHaveBeenCalledWith(mockSrcDir);
      expect(mockFileSystem.copy).toHaveBeenCalledWith(srcDirPath, destDirPath);
    });

    it('should copy directory immediately synchronously when no external operations exist', () => {
      const srcDirPath = '/src' as StandardizedFilePath;
      const destDirPath = '/dest' as StandardizedFilePath;
      const mockSrcDir = new MockDirectory(srcDirPath);
      const mockDestDir = new MockDirectory(destDirPath);

      jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
        if (path === srcDirPath) return mockSrcDir as any;
        if (path === destDirPath) return mockDestDir as any;
        return new MockDirectory(path) as any;
      });

      jest.spyOn(tfs as any, 'saveForDirectorySync').mockImplementation();
      jest.spyOn(tfs as any, 'removeDirAndSubDirs').mockImplementation();

      tfs.copyDirectoryImmediatelySync(srcDirPath, destDirPath);

      expect(tfs.saveForDirectorySync).toHaveBeenCalledWith(srcDirPath);
      expect(tfs.saveForDirectorySync).toHaveBeenCalledWith(destDirPath);
//      expect(tfs.removeDirAndSubDirs).toHaveBeenCalledWith(mockSrcDir);
      expect(mockFileSystem.copySync).toHaveBeenCalledWith(srcDirPath, destDirPath);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if there are external operations on the source directory', async () => {
      const srcDirPath = '/src' as StandardizedFilePath;
      const destDirPath = '/dest' as StandardizedFilePath;
      const mockSrcDir = new MockDirectory(srcDirPath);
      const mockDestDir = new MockDirectory(destDirPath);

      jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
        if (path === srcDirPath) return mockSrcDir as any;
        if (path === destDirPath) return mockDestDir as any;
        return new MockDirectory(path) as any;
      });

      mockSrcDir.getExternalOperations.mockReturnValue([{}]);

      await expect(tfs.copyDirectoryImmediately(srcDirPath, destDirPath)).rejects.toThrow(errors.InvalidOperationError);
    });

    it('should throw an error if there are external operations on the destination directory', async () => {
      const srcDirPath = '/src' as StandardizedFilePath;
      const destDirPath = '/dest' as StandardizedFilePath;
      const mockSrcDir = new MockDirectory(srcDirPath);
      const mockDestDir = new MockDirectory(destDirPath);

      jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
        if (path === srcDirPath) return mockSrcDir as any;
        if (path === destDirPath) return mockDestDir as any;
        return new MockDirectory(path) as any;
      });

      mockDestDir.getExternalOperations.mockReturnValue([{}]);

      await expect(tfs.copyDirectoryImmediately(srcDirPath, destDirPath)).rejects.toThrow(errors.InvalidOperationError);
    });

    it('should handle errors during file system copy operation', async () => {
      const srcDirPath = '/src' as StandardizedFilePath;
      const destDirPath = '/dest' as StandardizedFilePath;
      const mockSrcDir = new MockDirectory(srcDirPath);
      const mockDestDir = new MockDirectory(destDirPath);

      jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
        if (path === srcDirPath) return mockSrcDir as any;
        if (path === destDirPath) return mockDestDir as any;
        return new MockDirectory(path) as any;
      });

      jest.spyOn(tfs as any, 'saveForDirectory').mockResolvedValue(undefined as never);
      jest.spyOn(tfs as any, 'removeDirAndSubDirs').mockImplementation();
      mockFileSystem.copy.mockRejectedValue(new Error('Copy failed'));

      await expect(tfs.copyDirectoryImmediately(srcDirPath, destDirPath)).rejects.toThrow('Copy failed');
    });
  });
});

// End of unit tests for: copyDirectoryImmediately
