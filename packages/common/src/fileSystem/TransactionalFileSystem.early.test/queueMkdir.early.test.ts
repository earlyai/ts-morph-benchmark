
// Unit tests for: queueMkdir

import { SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";




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
  public childDirs = new SortedKeyValueArray<StandardizedFilePath, MockDirectory>(
    (item: any) => item.path,
    LocaleStringComparer.instance
  );

  constructor(public path: StandardizedFilePath) {}

  public setIsDeleted = jest.fn();
  public getParent = jest.fn();
  public getDescendants = jest.fn().mockReturnValue([]);
  public setParent = jest.fn();
}

class MockPathCasingMaintainer {
  public getPath = jest.fn().mockReturnValue('mockPath');
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles?: boolean;
  libFolderPath?: string;
}

describe('TransactionalFileSystem.queueMkdir() queueMkdir method', () => {
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
    test('should queue mkdir operation for a new directory', () => {
      const dirPath: StandardizedFilePath = 'mockDirPath' as any;
      const mockDir = new MockDirectory(dirPath) as any;
      const mockParentDir = new MockDirectory('mockParentDirPath' as any) as any;

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValueOnce(mockDir);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValueOnce(mockParentDir);

      transactionalFileSystem.queueMkdir(dirPath);

      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
      expect(mockParentDir.operations).toContainEqual({
        kind: 'mkdir',
        index: expect.any(Number),
        dir: mockDir,
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle mkdir for a directory that already exists', () => {
      const dirPath: StandardizedFilePath = 'mockDirPath' as any;
      const mockDir = new MockDirectory(dirPath) as any;
      const mockParentDir = new MockDirectory('mockParentDirPath' as any) as any;

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValueOnce(mockDir);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValueOnce(mockParentDir);

      transactionalFileSystem.queueMkdir(dirPath);

      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
      expect(mockParentDir.operations).toContainEqual({
        kind: 'mkdir',
        index: expect.any(Number),
        dir: mockDir,
      });
    });

    test.skip('should handle mkdir for a directory with a deleted parent', () => {
      const dirPath: StandardizedFilePath = 'mockDirPath' as any;
      const mockDir = new MockDirectory(dirPath) as any;
      const mockParentDir = new MockDirectory('mockParentDirPath' as any);
      mockParentDir.isDeleted = true;

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory').mockReturnValueOnce(mockDir);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValueOnce(mockParentDir as any);

      transactionalFileSystem.queueMkdir(dirPath);

      expect(mockDir.setIsDeleted).toHaveBeenCalledWith(false);
      expect(mockParentDir.setIsDeleted).toHaveBeenCalledWith(false);
      expect(mockParentDir.operations).toContainEqual({
        kind: 'mkdir',
        index: expect.any(Number),
        dir: mockDir,
      });
    });
  });
});

// End of unit tests for: queueMkdir
