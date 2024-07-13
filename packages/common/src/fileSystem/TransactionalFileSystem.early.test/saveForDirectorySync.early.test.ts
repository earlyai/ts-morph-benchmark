
// Unit tests for: saveForDirectorySync



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
  public path: StandardizedFilePath = '' as StandardizedFilePath;

  constructor(path: StandardizedFilePath) {
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

describe('TransactionalFileSystem.saveForDirectorySync() saveForDirectorySync method', () => {
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
    it('should save directory synchronously without external operations', () => {
      const mockDir = new MockDirectory('mockDirPath' as StandardizedFilePath);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'throwIfHasExternalOperations').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExistsSync').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'getAndClearOperationsForDir').mockReturnValue([]);
      jest.spyOn(transactionalFileSystem as any, 'executeOperationSync').mockImplementation();

      transactionalFileSystem.saveForDirectorySync('mockDirPath' as StandardizedFilePath);

      expect(transactionalFileSystem['getOrCreateDirectory']).toHaveBeenCalledWith('mockDirPath' as StandardizedFilePath);
      expect(transactionalFileSystem['throwIfHasExternalOperations']).toHaveBeenCalledWith(mockDir, 'save directory');
      expect(transactionalFileSystem['ensureDirectoryExistsSync']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['getAndClearOperationsForDir']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['executeOperationSync']).not.toHaveBeenCalled();
    });

    it('should execute operations synchronously', () => {
      const mockDir = new MockDirectory('mockDirPath' as StandardizedFilePath);
      const mockOperation = { kind: 'mkdir', index: 0, dir: mockDir };
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'throwIfHasExternalOperations').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExistsSync').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'getAndClearOperationsForDir').mockReturnValue([mockOperation]);
      jest.spyOn(transactionalFileSystem as any, 'executeOperationSync').mockImplementation();

      transactionalFileSystem.saveForDirectorySync('mockDirPath' as StandardizedFilePath);

      expect(transactionalFileSystem['executeOperationSync']).toHaveBeenCalledWith(mockOperation);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if there are external operations', () => {
      const mockDir = new MockDirectory('mockDirPath' as StandardizedFilePath);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'throwIfHasExternalOperations').mockImplementation(() => {
        throw new errors.InvalidOperationError('External operations exist');
      });

      expect(() => {
        transactionalFileSystem.saveForDirectorySync('mockDirPath' as StandardizedFilePath);
      }).toThrow(errors.InvalidOperationError);
    });

    it('should handle directories that were once deleted', () => {
      const mockDir = new MockDirectory('mockDirPath' as StandardizedFilePath);
      mockDir.getWasEverDeleted = jest.fn().mockReturnValue(true);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'throwIfHasExternalOperations').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExistsSync').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'getAndClearOperationsForDir').mockReturnValue([]);
      jest.spyOn(transactionalFileSystem as any, 'executeOperationSync').mockImplementation();

      transactionalFileSystem.saveForDirectorySync('mockDirPath' as StandardizedFilePath);

      expect(transactionalFileSystem['getOrCreateDirectory']).toHaveBeenCalledWith('mockDirPath' as StandardizedFilePath);
      expect(transactionalFileSystem['throwIfHasExternalOperations']).toHaveBeenCalledWith(mockDir, 'save directory');
      expect(transactionalFileSystem['ensureDirectoryExistsSync']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['getAndClearOperationsForDir']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['executeOperationSync']).not.toHaveBeenCalled();
    });

    it.skip('should handle directories that are root directories', () => {
      const mockDir = new MockDirectory('mockDirPath' as StandardizedFilePath);
      mockDir.isRootDir = jest.fn().mockReturnValue(true);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValue(mockDir as any);
      jest.spyOn(transactionalFileSystem as any, 'throwIfHasExternalOperations').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'ensureDirectoryExistsSync').mockImplementation();
      jest.spyOn(transactionalFileSystem as any, 'getAndClearOperationsForDir').mockReturnValue([]);
      jest.spyOn(transactionalFileSystem as any, 'executeOperationSync').mockImplementation();

      transactionalFileSystem.saveForDirectorySync('mockDirPath' as StandardizedFilePath);

      expect(transactionalFileSystem['getOrCreateDirectory']).toHaveBeenCalledWith('mockDirPath' as StandardizedFilePath);
      expect(transactionalFileSystem['throwIfHasExternalOperations']).toHaveBeenCalledWith(mockDir, 'save directory');
      expect(transactionalFileSystem['ensureDirectoryExistsSync']).not.toHaveBeenCalled();
      expect(transactionalFileSystem['getAndClearOperationsForDir']).toHaveBeenCalledWith(mockDir);
      expect(transactionalFileSystem['executeOperationSync']).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: saveForDirectorySync
