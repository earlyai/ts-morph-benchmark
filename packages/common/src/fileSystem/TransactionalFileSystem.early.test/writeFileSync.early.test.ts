
// Unit tests for: writeFileSync



import { errors } from "../../errors";



import { FileSystemHost } from "../FileSystemHost";


import { StandardizedFilePath } from "../StandardizedFilePath";

import { TransactionalFileSystem, TransactionalFileSystemOptions } from '../TransactionalFileSystem';


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
  public getPath = jest.fn().mockImplementation((path: StandardizedFilePath) => path);
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions extends TransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles: boolean | undefined;
  libFolderPath: string | undefined;
}

describe('TransactionalFileSystem.writeFileSync() writeFileSync method', () => {
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer();

    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
      libFolderPath: undefined,
    } as any;

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it('should write a file successfully', () => {
      const filePath: StandardizedFilePath = '/path/to/file.txt' as any;
      const fileText = 'Hello, World!';
      const mockParentDir = new MockDirectory('/path/to' as any);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExistsSync').mockImplementation();

      transactionalFileSystem.writeFileSync(filePath, fileText);

      expect(mockParentDir.dequeueFileDelete).toHaveBeenCalledWith(filePath);
      expect(mockFileSystem.writeFileSync).toHaveBeenCalledWith(filePath, fileText);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the file is a lib file', () => {
      const filePath: StandardizedFilePath = '/path/to/lib/file.txt' as any;
      const fileText = 'Hello, World!';

      jest.spyOn(transactionalFileSystem as any, 'libFileExists').mockReturnValue(true);

      expect(() => transactionalFileSystem.writeFileSync(filePath, fileText)).toThrow(errors.InvalidOperationError);
    });

    it('should throw an error if there are external operations', () => {
      const filePath: StandardizedFilePath = '/path/to/file.txt' as any;
      const fileText = 'Hello, World!';
      const mockParentDir = new MockDirectory('/path/to' as any);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);
      jest.spyOn(mockParentDir, 'getExternalOperations').mockReturnValue([{}]);

      expect(() => transactionalFileSystem.writeFileSync(filePath, fileText)).toThrow(errors.InvalidOperationError);
    });
  });
});

// End of unit tests for: writeFileSync
