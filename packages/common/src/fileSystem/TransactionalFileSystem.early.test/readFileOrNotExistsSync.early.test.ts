
// Unit tests for: readFileOrNotExistsSync

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
  public caseInsensitiveMappings: Map<StandardizedFilePath, StandardizedFilePath> | undefined = new Map();

  constructor(public fileSystem: FileSystemHost) {}

  public getPath = jest.fn();
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles: boolean | undefined;
  libFolderPath: string | undefined;
}

describe('TransactionalFileSystem.readFileOrNotExistsSync() readFileOrNotExistsSync method', () => {
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer(mockFileSystem) as any;
    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
      libFolderPath: undefined,
    } as any;

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('readFileOrNotExistsSync', () => {
    it('should return the content of a library file if it exists', () => {
      const filePath = 'libFilePath' as StandardizedFilePath;
      const encoding = 'utf-8';
      const libFileText = 'lib file content';

      jest.spyOn(transactionalFileSystem as any, 'readLibFile').mockReturnValue(libFileText);

      const result = transactionalFileSystem.readFileOrNotExistsSync(filePath, encoding);

      expect(result).toBe(libFileText);
      expect((transactionalFileSystem as any).readLibFile).toHaveBeenCalledWith(filePath);
    });

    it('should return false if the file is queued for deletion', () => {
      const filePath = 'queuedForDeletionFilePath' as StandardizedFilePath;
      const encoding = 'utf-8';

      jest.spyOn(transactionalFileSystem as any, 'readLibFile').mockReturnValue(null);
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(true);

      const result = transactionalFileSystem.readFileOrNotExistsSync(filePath, encoding);

      expect(result).toBe(false);
      expect((transactionalFileSystem as any).isPathQueuedForDeletion).toHaveBeenCalledWith(filePath);
    });

    it('should return the content of the file if it exists', () => {
      const filePath = 'existingFilePath' as StandardizedFilePath;
      const encoding = 'utf-8';
      const fileContent = 'file content';

      jest.spyOn(transactionalFileSystem as any, 'readLibFile').mockReturnValue(null);
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(false);
      jest.spyOn(FileUtils, 'readFileOrNotExistsSync').mockReturnValue(fileContent);

      const result = transactionalFileSystem.readFileOrNotExistsSync(filePath, encoding);

      expect(result).toBe(fileContent);
      expect(FileUtils.readFileOrNotExistsSync).toHaveBeenCalledWith(mockFileSystem, filePath, encoding);
    });

    it('should return false if the file does not exist', () => {
      const filePath = 'nonExistingFilePath' as StandardizedFilePath;
      const encoding = 'utf-8';

      jest.spyOn(transactionalFileSystem as any, 'readLibFile').mockReturnValue(null);
      jest.spyOn(transactionalFileSystem as any, 'isPathQueuedForDeletion').mockReturnValue(false);
      jest.spyOn(FileUtils, 'readFileOrNotExistsSync').mockReturnValue(false);

      const result = transactionalFileSystem.readFileOrNotExistsSync(filePath, encoding);

      expect(result).toBe(false);
      expect(FileUtils.readFileOrNotExistsSync).toHaveBeenCalledWith(mockFileSystem, filePath, encoding);
    });
  });
});

// End of unit tests for: readFileOrNotExistsSync
