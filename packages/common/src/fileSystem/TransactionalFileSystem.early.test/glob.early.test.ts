
// Unit tests for: glob

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
  public path: MockStandardizedFilePath;
  public operations: any[] = [];
  public inboundOperations: any[] = [];
  public isDeleted: boolean = false;
  public wasEverDeleted: boolean = false;
  public parent: MockDirectory | undefined = undefined;
  public childDirs = new SortedKeyValueArray<MockStandardizedFilePath, MockDirectory>(
    (item) => item.path,
    LocaleStringComparer.instance
  );

  constructor(path: MockStandardizedFilePath) {
    this.path = path;
  }

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

describe('TransactionalFileSystem.glob() glob method', () => {
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
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it('should return standardized file paths that are not queued for deletion', async () => {
      const patterns = ['**/*.ts'];
      const mockFilePaths = ['/path/to/file1.ts', '/path/to/file2.ts'];
      (mockFileSystem.glob as jest.Mock).mockResolvedValue(mockFilePaths);
      (transactionalFileSystem as any).getStandardizedAbsolutePath = jest.fn().mockImplementation((path) => path);
      (transactionalFileSystem as any).isPathQueuedForDeletion = jest.fn().mockReturnValue(false);

      const result = await transactionalFileSystem.glob(patterns);

      expect(result).toEqual(mockFilePaths);
      expect(mockFileSystem.glob).toHaveBeenCalledWith(patterns);
      expect((transactionalFileSystem as any).getStandardizedAbsolutePath).toHaveBeenCalledWith('/path/to/file1.ts');
      expect((transactionalFileSystem as any).getStandardizedAbsolutePath).toHaveBeenCalledWith('/path/to/file2.ts');
      expect((transactionalFileSystem as any).isPathQueuedForDeletion).toHaveBeenCalledWith('/path/to/file1.ts');
      expect((transactionalFileSystem as any).isPathQueuedForDeletion).toHaveBeenCalledWith('/path/to/file2.ts');
    });

    it('should filter out file paths that are queued for deletion', async () => {
      const patterns = ['**/*.ts'];
      const mockFilePaths = ['/path/to/file1.ts', '/path/to/file2.ts'];
      (mockFileSystem.glob as jest.Mock).mockResolvedValue(mockFilePaths);
      (transactionalFileSystem as any).getStandardizedAbsolutePath = jest.fn().mockImplementation((path) => path);
      (transactionalFileSystem as any).isPathQueuedForDeletion = jest.fn()
        .mockImplementation((path) => path === '/path/to/file1.ts');

      const result = await transactionalFileSystem.glob(patterns);

      expect(result).toEqual(['/path/to/file2.ts']);
      expect(mockFileSystem.glob).toHaveBeenCalledWith(patterns);
      expect((transactionalFileSystem as any).getStandardizedAbsolutePath).toHaveBeenCalledWith('/path/to/file1.ts');
      expect((transactionalFileSystem as any).getStandardizedAbsolutePath).toHaveBeenCalledWith('/path/to/file2.ts');
      expect((transactionalFileSystem as any).isPathQueuedForDeletion).toHaveBeenCalledWith('/path/to/file1.ts');
      expect((transactionalFileSystem as any).isPathQueuedForDeletion).toHaveBeenCalledWith('/path/to/file2.ts');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty patterns array', async () => {
      const patterns: string[] = [];
      (mockFileSystem.glob as jest.Mock).mockResolvedValue([]);

      const result = await transactionalFileSystem.glob(patterns);

      expect(result).toEqual([]);
      expect(mockFileSystem.glob).toHaveBeenCalledWith(patterns);
    });

    it('should handle no matching files', async () => {
      const patterns = ['**/*.ts'];
      (mockFileSystem.glob as jest.Mock).mockResolvedValue([]);

      const result = await transactionalFileSystem.glob(patterns);

      expect(result).toEqual([]);
      expect(mockFileSystem.glob).toHaveBeenCalledWith(patterns);
    });

    it('should handle errors thrown by the file system', async () => {
      const patterns = ['**/*.ts'];
      const error = new Error('File system error');
      (mockFileSystem.glob as jest.Mock).mockRejectedValue(error);

      await expect(transactionalFileSystem.glob(patterns)).rejects.toThrow('File system error');
      expect(mockFileSystem.glob).toHaveBeenCalledWith(patterns);
    });
  });
});

// End of unit tests for: glob
