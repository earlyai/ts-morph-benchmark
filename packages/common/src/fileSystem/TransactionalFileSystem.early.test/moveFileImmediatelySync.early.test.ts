
// Unit tests for: moveFileImmediatelySync



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

describe('TransactionalFileSystem.moveFileImmediatelySync() moveFileImmediatelySync method', () => {
  let mockFileSystem: FileSystemHost;
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer() as any;

    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  it('should move a file immediately under normal conditions', () => {
    const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
    const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
    const fileText = 'file content';

    const mockOldParentDir = new MockDirectory('old/path' as StandardizedFilePath);
    const mockNewParentDir = new MockDirectory('new/path' as StandardizedFilePath);

    jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
      .mockReturnValueOnce(mockOldParentDir as any)
      .mockReturnValueOnce(mockNewParentDir as any);

    jest.spyOn(transactionalFileSystem as any, 'writeFileSync').mockImplementation();
    jest.spyOn(transactionalFileSystem as any, 'deleteFileImmediatelySync').mockImplementation();

    transactionalFileSystem.moveFileImmediatelySync(oldFilePath, newFilePath, fileText);

    expect(transactionalFileSystem.writeFileSync).toHaveBeenCalledWith(newFilePath, fileText);
    expect(transactionalFileSystem.deleteFileImmediatelySync).toHaveBeenCalledWith(oldFilePath);
  });

  it('should throw an error if the new file path is a lib file', () => {
    const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
    const newFilePath = 'lib/path/file.txt' as StandardizedFilePath;
    const fileText = 'file content';

    jest.spyOn(transactionalFileSystem as any, 'libFileExists').mockReturnValue(true);

    expect(() => {
      transactionalFileSystem.moveFileImmediatelySync(oldFilePath, newFilePath, fileText);
    }).toThrow(errors.InvalidOperationError);
  });

  it('should throw an error if there are external operations on the old file path', () => {
    const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
    const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
    const fileText = 'file content';

    const mockOldParentDir = new MockDirectory('old/path' as StandardizedFilePath);
    const mockNewParentDir = new MockDirectory('new/path' as StandardizedFilePath);

    jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
      .mockReturnValueOnce(mockOldParentDir as any)
      .mockReturnValueOnce(mockNewParentDir as any);

    jest.spyOn(mockOldParentDir, 'getExternalOperations').mockReturnValue([{}]);

    expect(() => {
      transactionalFileSystem.moveFileImmediatelySync(oldFilePath, newFilePath, fileText);
    }).toThrow(errors.InvalidOperationError);
  });

  it('should throw an error if there are external operations on the new file path', () => {
    const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
    const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
    const fileText = 'file content';

    const mockOldParentDir = new MockDirectory('old/path' as StandardizedFilePath);
    const mockNewParentDir = new MockDirectory('new/path' as StandardizedFilePath);

    jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
      .mockReturnValueOnce(mockOldParentDir as any)
      .mockReturnValueOnce(mockNewParentDir as any);

    jest.spyOn(mockNewParentDir, 'getExternalOperations').mockReturnValue([{}]);

    expect(() => {
      transactionalFileSystem.moveFileImmediatelySync(oldFilePath, newFilePath, fileText);
    }).toThrow(errors.InvalidOperationError);
  });

  it.skip('should handle errors during file deletion and queue the file for deletion', () => {
    const oldFilePath = 'old/path/file.txt' as StandardizedFilePath;
    const newFilePath = 'new/path/file.txt' as StandardizedFilePath;
    const fileText = 'file content';

    const mockOldParentDir = new MockDirectory('old/path' as StandardizedFilePath);
    const mockNewParentDir = new MockDirectory('new/path' as StandardizedFilePath);

    jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory')
      .mockReturnValueOnce(mockOldParentDir as any)
      .mockReturnValueOnce(mockNewParentDir as any);

    jest.spyOn(transactionalFileSystem as any, 'writeFileSync').mockImplementation();
    jest.spyOn(transactionalFileSystem as any, 'deleteFileImmediatelySync').mockImplementation(() => {
      throw new Error('Deletion error');
    });
    jest.spyOn(transactionalFileSystem as any, 'queueFileDelete').mockImplementation();

    expect(() => {
      transactionalFileSystem.moveFileImmediatelySync(oldFilePath, newFilePath, fileText);
    }).toThrow('Deletion error');

    expect(transactionalFileSystem.queueFileDelete).toHaveBeenCalledWith(oldFilePath);
  });
});

// End of unit tests for: moveFileImmediatelySync
