
// Unit tests for: readFileOrNotExists

import { SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";




import { FileSystemHost } from "../FileSystemHost";

import { FileUtils } from "../FileUtils";

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

describe('TransactionalFileSystem.readFileOrNotExists() readFileOrNotExists method', () => {
  let mockFileSystem: jest.Mocked<FileSystemHost>;
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer();
    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    it('should return the content of a lib file if it exists', async () => {
      const filePath = 'libFilePath' as StandardizedFilePath;
      const fileContent = 'lib file content';
      (transactionalFileSystem as any).libFileMap = new Map([[filePath, fileContent]]);

      const result = await transactionalFileSystem.readFileOrNotExists(filePath, 'utf-8');

      expect(result).toBe(fileContent);
    });

    it('should return the content of a file if it exists', async () => {
      const filePath = 'filePath' as StandardizedFilePath;
      const fileContent = 'file content';
      mockFileSystem.readFile.mockResolvedValue(fileContent as any as never);

      const result = await transactionalFileSystem.readFileOrNotExists(filePath, 'utf-8');

      expect(result).toBe(fileContent);
      expect(mockFileSystem.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should return false if the file is queued for deletion', async () => {
      const filePath = 'filePath' as StandardizedFilePath;
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(true);

      const result = await transactionalFileSystem.readFileOrNotExists(filePath, 'utf-8');

      expect(result).toBe(false);
    });

    it('should return false if the file does not exist', async () => {
      const filePath = 'filePath' as StandardizedFilePath;
      jest.spyOn(FileUtils, 'readFileOrNotExists').mockResolvedValue(false as any as never);

      const result = await transactionalFileSystem.readFileOrNotExists(filePath, 'utf-8');

      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle errors thrown by the file system', async () => {
      const filePath = 'filePath' as StandardizedFilePath;
      const error = new Error('File system error');
      mockFileSystem.readFile.mockRejectedValue(error as never);

      await expect(transactionalFileSystem.readFileOrNotExists(filePath, 'utf-8')).rejects.toThrow(error);
    });

    it('should handle files that are queued for deletion', async () => {
      const filePath = 'filePath' as StandardizedFilePath;
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(true);

      const result = await transactionalFileSystem.readFileOrNotExists(filePath, 'utf-8');

      expect(result).toBe(false);
    });

    it.skip('should handle lib files that are queued for deletion', async () => {
      const filePath = 'libFilePath' as StandardizedFilePath;
      const fileContent = 'lib file content';
      (transactionalFileSystem as any).libFileMap = new Map([[filePath, fileContent]]);
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(true);

      const result = await transactionalFileSystem.readFileOrNotExists(filePath, 'utf-8');

      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: readFileOrNotExists
