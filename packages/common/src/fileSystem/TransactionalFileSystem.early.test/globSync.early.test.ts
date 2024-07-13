
// Unit tests for: globSync

import { SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";




import { FileSystemHost } from "../FileSystemHost";



import { TransactionalFileSystem } from '../TransactionalFileSystem';


jest.mock('../../getLibFiles', () => {
  const actual = jest.requireActual('../../getLibFiles');
  return {
    ...actual,
    getLibFiles: jest.fn(),
    getLibFolderPath: jest.fn(),
  };
});

type MockStandardizedFilePath = string;

class MockDirectory {
  public operations: any[] = [];
  public inboundOperations: any[] = [];
  public isDeleted: boolean = false;
  public wasEverDeleted: boolean = false;
  public parent: MockDirectory | undefined = undefined;
  public childDirs = new SortedKeyValueArray<MockStandardizedFilePath, MockDirectory>(
    (item: any) => item.path,
    LocaleStringComparer.instance
  );

  constructor(public path: MockStandardizedFilePath) {}

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
  skipLoadingLibFiles: boolean | undefined;
  libFolderPath: string | undefined;
}

describe('TransactionalFileSystem.globSync() globSync method', () => {
  let mockFileSystem: FileSystemHost;
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer() as any;

    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
      libFolderPath: undefined,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it('should return standardized file paths that are not queued for deletion', () => {
      const patterns = ['**/*.ts'];
      const filePaths = ['/path/to/file1.ts', '/path/to/file2.ts'];
      const standardizedFilePaths = ['/standardized/path/to/file1.ts', '/standardized/path/to/file2.ts'];

      (mockFileSystem.globSync as jest.Mock).mockReturnValue(filePaths);
      (transactionalFileSystem as any).getStandardizedAbsolutePath = jest.fn()
        .mockReturnValueOnce(standardizedFilePaths[0])
        .mockReturnValueOnce(standardizedFilePaths[1]);
      (transactionalFileSystem as any).isPathQueuedForDeletion = jest.fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);

      const result = Array.from(transactionalFileSystem.globSync(patterns));

      expect(result).toEqual(standardizedFilePaths);
      expect(mockFileSystem.globSync).toHaveBeenCalledWith(patterns);
      expect((transactionalFileSystem as any).getStandardizedAbsolutePath).toHaveBeenCalledTimes(2);
      expect((transactionalFileSystem as any).isPathQueuedForDeletion).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should not return file paths that are queued for deletion', () => {
      const patterns = ['**/*.ts'];
      const filePaths = ['/path/to/file1.ts', '/path/to/file2.ts'];
      const standardizedFilePaths = ['/standardized/path/to/file1.ts', '/standardized/path/to/file2.ts'];

      (mockFileSystem.globSync as jest.Mock).mockReturnValue(filePaths);
      (transactionalFileSystem as any).getStandardizedAbsolutePath = jest.fn()
        .mockReturnValueOnce(standardizedFilePaths[0])
        .mockReturnValueOnce(standardizedFilePaths[1]);
      (transactionalFileSystem as any).isPathQueuedForDeletion = jest.fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const result = Array.from(transactionalFileSystem.globSync(patterns));

      expect(result).toEqual([standardizedFilePaths[1]]);
      expect(mockFileSystem.globSync).toHaveBeenCalledWith(patterns);
      expect((transactionalFileSystem as any).getStandardizedAbsolutePath).toHaveBeenCalledTimes(2);
      expect((transactionalFileSystem as any).isPathQueuedForDeletion).toHaveBeenCalledTimes(2);
    });

    it('should handle empty patterns array', () => {
      const patterns: string[] = [];
      const filePaths: string[] = [];

      (mockFileSystem.globSync as jest.Mock).mockReturnValue(filePaths);

      const result = Array.from(transactionalFileSystem.globSync(patterns));

      expect(result).toEqual([]);
      expect(mockFileSystem.globSync).toHaveBeenCalledWith(patterns);
    });

    it('should handle no matching files', () => {
      const patterns = ['**/*.ts'];
      const filePaths: string[] = [];

      (mockFileSystem.globSync as jest.Mock).mockReturnValue(filePaths);

      const result = Array.from(transactionalFileSystem.globSync(patterns));

      expect(result).toEqual([]);
      expect(mockFileSystem.globSync).toHaveBeenCalledWith(patterns);
    });
  });
});

// End of unit tests for: globSync
