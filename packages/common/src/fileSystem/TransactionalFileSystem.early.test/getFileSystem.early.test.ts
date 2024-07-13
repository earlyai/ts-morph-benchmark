
// Unit tests for: getFileSystem

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
  public childDirs: SortedKeyValueArray<MockStandardizedFilePath, MockDirectory> = new SortedKeyValueArray(
    (item: any) => item.path,
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

describe('TransactionalFileSystem.getFileSystem() getFileSystem method', () => {
  let mockFileSystemHost: FileSystemHost;
  let mockPathCasingMaintainer: MockPathCasingMaintainer;
  let mockOptions: MockTransactionalFileSystemOptions;
  let transactionalFileSystem: TransactionalFileSystem;

  beforeEach(() => {
    mockFileSystemHost = {
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
      fileSystem: mockFileSystemHost,
      skipLoadingLibFiles: true,
      libFolderPath: undefined,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    test('should return the file system host', () => {
      // Act
      const result = transactionalFileSystem.getFileSystem();

      // Assert
      expect(result).toBe(mockFileSystemHost);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should handle case where file system host is undefined', () => {
      // Arrange
      mockOptions.fileSystem = undefined as any;

      // Act
      transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
      const result = transactionalFileSystem.getFileSystem();

      // Assert
      expect(result).toBeUndefined();
    });

    test.skip('should handle case where file system host is null', () => {
      // Arrange
      mockOptions.fileSystem = null as any;

      // Act
      transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
      const result = transactionalFileSystem.getFileSystem();

      // Assert
      expect(result).toBeNull();
    });
  });
});

// End of unit tests for: getFileSystem
