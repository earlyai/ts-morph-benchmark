
// Unit tests for: writeFile



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
  public isDescendant = jest.fn().mockReturnValue(false);
  public getIsDeleted = jest.fn().mockReturnValue(this.isDeleted);
  public getWasEverDeleted = jest.fn().mockReturnValue(this.wasEverDeleted);
  public setIsDeleted = jest.fn();
  public getParent = jest.fn().mockReturnValue(this.parent);
  public setParent = jest.fn();
  public removeParent = jest.fn();
  public getAncestors = jest.fn().mockReturnValue([]);
  public getAncestorsIterator = jest.fn().mockReturnValue([]);
  public getChildrenEntriesIterator = jest.fn().mockReturnValue([]);
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

describe('TransactionalFileSystem.writeFile() writeFile method', () => {
  let mockFileSystem: FileSystemHost;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
  let transactionalFileSystem: TransactionalFileSystem;

  beforeEach(() => {
    mockFileSystem = {
      isCaseSensitive: jest.fn().mockReturnValue(true),
      delete: jest.fn(),
      deleteSync: jest.fn(),
      readDirSync: jest.fn().mockReturnValue([]),
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

  describe('Happy Path', () => {
    test('should write a file successfully', async () => {
      const filePath = 'some/path/file.txt' as StandardizedFilePath;
      const fileText = 'Hello, World!';
      const mockParentDir = new MockDirectory('some/path' as StandardizedFilePath) as any;

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir);
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExists').mockResolvedValue(undefined);

      await transactionalFileSystem.writeFile(filePath, fileText);

      expect(mockParentDir.dequeueFileDelete).toHaveBeenCalledWith(filePath);
      expect(mockFileSystem.writeFile).toHaveBeenCalledWith(filePath, fileText);
    });

    test('should write a file synchronously', () => {
      const filePath = 'some/path/file.txt' as StandardizedFilePath;
      const fileText = 'Hello, World!';
      const mockParentDir = new MockDirectory('some/path' as StandardizedFilePath) as any;

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir);
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExistsSync').mockReturnValue(undefined);

      transactionalFileSystem.writeFileSync(filePath, fileText);

      expect(mockParentDir.dequeueFileDelete).toHaveBeenCalledWith(filePath);
      expect(mockFileSystem.writeFileSync).toHaveBeenCalledWith(filePath, fileText);
    });
  });

  describe('Edge Cases', () => {
    test('should throw an error if the file is a lib file', async () => {
      const filePath = 'lib/file.txt' as StandardizedFilePath;
      const fileText = 'Hello, World!';

      jest.spyOn(transactionalFileSystem as any, 'libFileExists').mockReturnValue(true);

      await expect(transactionalFileSystem.writeFile(filePath, fileText)).rejects.toThrow(errors.InvalidOperationError);
    });

    test('should throw an error if there are external operations', async () => {
      const filePath = 'some/path/file.txt' as StandardizedFilePath;
      const fileText = 'Hello, World!';
      const mockParentDir = new MockDirectory('some/path' as StandardizedFilePath) as any;

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir);
      jest.spyOn(transactionalFileSystem as any, 'throwIfHasExternalOperations').mockImplementation(() => {
        throw new errors.InvalidOperationError('External operations exist');
      });

      await expect(transactionalFileSystem.writeFile(filePath, fileText)).rejects.toThrow(errors.InvalidOperationError);
    });

    test('should handle directory creation failure gracefully', async () => {
      const filePath = 'some/path/file.txt' as StandardizedFilePath;
      const fileText = 'Hello, World!';
      const mockParentDir = new MockDirectory('some/path' as StandardizedFilePath) as any;

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir);
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExists').mockRejectedValue(new Error('Directory creation failed'));

      await expect(transactionalFileSystem.writeFile(filePath, fileText)).rejects.toThrow('Directory creation failed');
    });
  });
});

// End of unit tests for: writeFile
