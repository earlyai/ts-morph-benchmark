
// Unit tests for: getCurrentDirectory






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
  public childDirs: any = {
    entries: jest.fn().mockReturnValue([]),
    set: jest.fn(),
    removeByValue: jest.fn(),
  };

  constructor(path: MockStandardizedFilePath) {
    this.path = path;
  }

  public getExternalOperations = jest.fn().mockReturnValue([]);
  public isDescendantOrEqual = jest.fn().mockReturnValue(false);
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

describe('TransactionalFileSystem.getCurrentDirectory() getCurrentDirectory method', () => {
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
      realpathSync: jest.fn().mockReturnValue('/mock/current/directory'),
      getCurrentDirectory: jest.fn().mockReturnValue('/mock/current/directory'),
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
    it('should return the current directory path in a standardized format', () => {
      // Arrange
      const expectedPath = '/mock/current/directory';
      mockFileSystem.getCurrentDirectory = jest.fn().mockReturnValue(expectedPath);
      mockPathCasingMaintainer.getPath = jest.fn().mockReturnValue(expectedPath);

      // Act
      const result = transactionalFileSystem.getCurrentDirectory();

      // Assert
      expect(result).toBe(expectedPath);
      expect(mockFileSystem.getCurrentDirectory).toHaveBeenCalled();
      expect(mockPathCasingMaintainer.getPath).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle case where getCurrentDirectory returns an empty string', () => {
      // Arrange
      const expectedPath = '';
      mockFileSystem.getCurrentDirectory = jest.fn().mockReturnValue(expectedPath);
      mockPathCasingMaintainer.getPath = jest.fn().mockReturnValue(expectedPath);

      // Act
      const result = transactionalFileSystem.getCurrentDirectory();

      // Assert
      expect(result).toBe(expectedPath);
      expect(mockFileSystem.getCurrentDirectory).toHaveBeenCalled();
      expect(mockPathCasingMaintainer.getPath).toHaveBeenCalledWith(expectedPath);
    });

    it('should handle case where getCurrentDirectory returns a path with mixed casing', () => {
      // Arrange
      const mixedCasePath = '/Mock/Current/Directory';
      const expectedPath = '/mock/current/directory';
      mockFileSystem.getCurrentDirectory = jest.fn().mockReturnValue(mixedCasePath);
      mockPathCasingMaintainer.getPath = jest.fn().mockReturnValue(expectedPath);

      // Act
      const result = transactionalFileSystem.getCurrentDirectory();

      // Assert
      expect(result).toBe(expectedPath);
      expect(mockFileSystem.getCurrentDirectory).toHaveBeenCalled();
      expect(mockPathCasingMaintainer.getPath).toHaveBeenCalledWith(mixedCasePath);
    });

    it('should handle case where getCurrentDirectory throws an error', () => {
      // Arrange
      const errorMessage = 'Error getting current directory';
      mockFileSystem.getCurrentDirectory = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      expect(() => transactionalFileSystem.getCurrentDirectory()).toThrowError(errorMessage);
      expect(mockFileSystem.getCurrentDirectory).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: getCurrentDirectory
