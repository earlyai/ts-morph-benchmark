
// Unit tests for: fileExistsSync

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
  public getPath = jest.fn().mockImplementation((path: StandardizedFilePath) => path);
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles?: boolean;
  libFolderPath?: string;
}

describe('TransactionalFileSystem.fileExistsSync() fileExistsSync method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockLibFileMap: Map<StandardizedFilePath, string>;
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer();
    mockLibFileMap = new Map<StandardizedFilePath, string>();
    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
    (transactionalFileSystem as any).libFileMap = mockLibFileMap as any;
  });

  describe('Happy Path', () => {
    test('should return true if the file exists in the lib file map', () => {
      const filePath = 'libFile.ts' as StandardizedFilePath;
      mockLibFileMap.set(filePath, 'file content');

      const result = transactionalFileSystem.fileExistsSync(filePath);

      expect(result).toBe(true);
    });

    test('should return false if the file is deleted in memory', () => {
      const filePath = 'deletedFile.ts' as StandardizedFilePath;
      jest.spyOn(transactionalFileSystem as any, 'fileDeletedInMemory').mockReturnValue(true);

      const result = transactionalFileSystem.fileExistsSync(filePath);

      expect(result).toBe(false);
    });

    test('should return the result of fileSystem.fileExistsSync if the file is not in the lib file map and not deleted in memory', () => {
      const filePath = 'existingFile.ts' as StandardizedFilePath;
      mockFileSystem.fileExistsSync.mockReturnValue(true);

      const result = transactionalFileSystem.fileExistsSync(filePath);

      expect(result).toBe(true);
      expect(mockFileSystem.fileExistsSync).toHaveBeenCalledWith(filePath);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should handle case where file path is undefined', () => {
      const filePath = undefined as any as StandardizedFilePath;

      const result = transactionalFileSystem.fileExistsSync(filePath);

      expect(result).toBe(false);
    });

    test.skip('should handle case where file path is an empty string', () => {
      const filePath = '' as StandardizedFilePath;

      const result = transactionalFileSystem.fileExistsSync(filePath);

      expect(result).toBe(false);
    });

    test('should handle case where file path is a directory', () => {
      const filePath = 'someDirectory/' as StandardizedFilePath;
      mockFileSystem.fileExistsSync.mockReturnValue(false);

      const result = transactionalFileSystem.fileExistsSync(filePath);

      expect(result).toBe(false);
      expect(mockFileSystem.fileExistsSync).toHaveBeenCalledWith(filePath);
    });

    test('should handle case where file path is a non-standardized path', () => {
      const filePath = 'nonStandardizedPath' as StandardizedFilePath;
      mockFileSystem.fileExistsSync.mockReturnValue(true);

      const result = transactionalFileSystem.fileExistsSync(filePath);

      expect(result).toBe(true);
      expect(mockFileSystem.fileExistsSync).toHaveBeenCalledWith(filePath);
    });
  });
});

// End of unit tests for: fileExistsSync
