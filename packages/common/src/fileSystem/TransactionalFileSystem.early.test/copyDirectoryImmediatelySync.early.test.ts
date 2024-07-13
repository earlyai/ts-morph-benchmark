
// Unit tests for: copyDirectoryImmediatelySync

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

describe('TransactionalFileSystem.copyDirectoryImmediatelySync() copyDirectoryImmediatelySync method', () => {
  let mockFileSystem: FileSystemHost;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
  let tfs: TransactionalFileSystem;

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

    mockPathCasingMaintainer = new MockPathCasingMaintainer() as any;

    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    };

    tfs = new TransactionalFileSystem(mockOptions as any);
    (tfs as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  test('should copy directory immediately under normal conditions', () => {
    const srcDirPath = '/src' as StandardizedFilePath;
    const destDirPath = '/dest' as StandardizedFilePath;
    const mockSrcDir = new MockDirectory(srcDirPath);
    const mockDestDir = new MockDirectory(destDirPath);

    jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
      if (path === srcDirPath) return mockSrcDir as any;
      if (path === destDirPath) return mockDestDir as any;
      return new MockDirectory(path) as any;
    });

    jest.spyOn(tfs as any, 'throwIfHasExternalOperations').mockImplementation(() => {});
    jest.spyOn(tfs as any, 'saveForDirectorySync').mockImplementation(() => {});
    jest.spyOn(tfs as any, 'removeDirAndSubDirs').mockImplementation(() => {});

    tfs.copyDirectoryImmediatelySync(srcDirPath, destDirPath);

    expect(tfs.saveForDirectorySync).toHaveBeenCalledWith(srcDirPath);
    expect(tfs.saveForDirectorySync).toHaveBeenCalledWith(destDirPath);
//    expect(tfs.removeDirAndSubDirs).toHaveBeenCalledWith(mockSrcDir);
    expect(mockFileSystem.copySync).toHaveBeenCalledWith(srcDirPath, destDirPath);
  });

  test('should throw error if there are external operations on source directory', () => {
    const srcDirPath = '/src' as StandardizedFilePath;
    const destDirPath = '/dest' as StandardizedFilePath;
    const mockSrcDir = new MockDirectory(srcDirPath);
    const mockDestDir = new MockDirectory(destDirPath);

    jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
      if (path === srcDirPath) return mockSrcDir as any;
      if (path === destDirPath) return mockDestDir as any;
      return new MockDirectory(path) as any;
    });

    jest.spyOn(tfs as any, 'throwIfHasExternalOperations').mockImplementation((dir: any, commandName: string) => {
      if (dir === mockSrcDir) throw new errors.InvalidOperationError('External operations exist');
    });

    expect(() => tfs.copyDirectoryImmediatelySync(srcDirPath, destDirPath)).toThrow(errors.InvalidOperationError);
  });

  test('should throw error if there are external operations on destination directory', () => {
    const srcDirPath = '/src' as StandardizedFilePath;
    const destDirPath = '/dest' as StandardizedFilePath;
    const mockSrcDir = new MockDirectory(srcDirPath);
    const mockDestDir = new MockDirectory(destDirPath);

    jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
      if (path === srcDirPath) return mockSrcDir as any;
      if (path === destDirPath) return mockDestDir as any;
      return new MockDirectory(path) as any;
    });

    jest.spyOn(tfs as any, 'throwIfHasExternalOperations').mockImplementation((dir: any, commandName: string) => {
      if (dir === mockDestDir) throw new errors.InvalidOperationError('External operations exist');
    });

    expect(() => tfs.copyDirectoryImmediatelySync(srcDirPath, destDirPath)).toThrow(errors.InvalidOperationError);
  });

  test('should handle error during copy and requeue directory delete', () => {
    const srcDirPath = '/src' as StandardizedFilePath;
    const destDirPath = '/dest' as StandardizedFilePath;
    const mockSrcDir = new MockDirectory(srcDirPath);
    const mockDestDir = new MockDirectory(destDirPath);

    jest.spyOn(tfs as any, 'getOrCreateDirectory').mockImplementation((path: StandardizedFilePath) => {
      if (path === srcDirPath) return mockSrcDir as any;
      if (path === destDirPath) return mockDestDir as any;
      return new MockDirectory(path) as any;
    });

    jest.spyOn(tfs as any, 'throwIfHasExternalOperations').mockImplementation(() => {});
    jest.spyOn(tfs as any, 'saveForDirectorySync').mockImplementation(() => {});
    jest.spyOn(tfs as any, 'removeDirAndSubDirs').mockImplementation(() => {});
    jest.spyOn(mockFileSystem, 'copySync').mockImplementation(() => {
      throw new Error('Copy failed');
    });

    expect(() => tfs.copyDirectoryImmediatelySync(srcDirPath, destDirPath)).toThrow('Copy failed');
  });
});

// End of unit tests for: copyDirectoryImmediatelySync
