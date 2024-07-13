
// Unit tests for: queueCopyDirectory

import { SortedKeyValueArray } from "../../collections";

import { LocaleStringComparer } from "../../comparers";

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
  public childDirs = new SortedKeyValueArray<StandardizedFilePath, MockDirectory>(
    (item: any) => item.path,
    LocaleStringComparer.instance
  );

  constructor(public path: StandardizedFilePath) {}

  public setIsDeleted = jest.fn();
  public getParent = jest.fn();
  public setParent = jest.fn();
  public removeParent = jest.fn();
  public getDescendants = jest.fn().mockReturnValue([]);
  public getExternalOperations = jest.fn().mockReturnValue([]);
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

describe('TransactionalFileSystem.queueCopyDirectory() queueCopyDirectory method', () => {
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

    mockPathCasingMaintainer = new MockPathCasingMaintainer() as any;

    mockOptions = {
      fileSystem: mockFileSystem,
      skipLoadingLibFiles: true,
    };

    transactionalFileSystem = new TransactionalFileSystem(mockOptions as any);
    (transactionalFileSystem as any).pathCasingMaintainer = mockPathCasingMaintainer as any;
  });

  describe('Happy Path', () => {
    test('should queue a copy directory operation', () => {
      const srcPath: StandardizedFilePath = '/src' as any;
      const destPath: StandardizedFilePath = '/dest' as any;

      const mockParentDir = new MockDirectory('/' as any);
      const mockSrcDir = new MockDirectory(srcPath);
      const mockDestDir = new MockDirectory(destPath);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory')
        .mockReturnValueOnce(mockSrcDir as any)
        .mockReturnValueOnce(mockDestDir as any);

      transactionalFileSystem.queueCopyDirectory(srcPath, destPath);

      expect(mockParentDir.operations).toHaveLength(1);
      expect(mockParentDir.operations[0]).toEqual({
        kind: 'copy',
        index: 0,
        oldDir: mockSrcDir,
        newDir: mockDestDir,
      });

      expect(mockDestDir.inboundOperations).toHaveLength(1);
      expect(mockDestDir.inboundOperations[0]).toEqual({
        kind: 'copy',
        index: 0,
        oldDir: mockSrcDir,
        newDir: mockDestDir,
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle copying to a directory that already has a parent', () => {
      const srcPath: StandardizedFilePath = '/src' as any;
      const destPath: StandardizedFilePath = '/dest' as any;

      const mockParentDir = new MockDirectory('/' as any);
      const mockSrcDir = new MockDirectory(srcPath);
      const mockDestDir = new MockDirectory(destPath);
      const mockExistingParentDir = new MockDirectory('/existingParent' as any);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory')
        .mockReturnValueOnce(mockSrcDir as any)
        .mockReturnValueOnce(mockDestDir as any);

      mockDestDir.getParent.mockReturnValue(mockExistingParentDir as any);

      transactionalFileSystem.queueCopyDirectory(srcPath, destPath);

      expect(mockParentDir.operations).toHaveLength(1);
      expect(mockParentDir.operations[0]).toEqual({
        kind: 'copy',
        index: 0,
        oldDir: mockSrcDir,
        newDir: mockDestDir,
      });

      expect(mockExistingParentDir.inboundOperations).toHaveLength(1);
      expect(mockExistingParentDir.inboundOperations[0]).toEqual({
        kind: 'copy',
        index: 0,
        oldDir: mockSrcDir,
        newDir: mockDestDir,
      });
    });

    test.skip('should handle copying when source directory has external operations', () => {
      const srcPath: StandardizedFilePath = '/src' as any;
      const destPath: StandardizedFilePath = '/dest' as any;

      const mockParentDir = new MockDirectory('/' as any);
      const mockSrcDir = new MockDirectory(srcPath);
      const mockDestDir = new MockDirectory(destPath);

      jest.spyOn(transactionalFileSystem as any, 'getOrCreateParentDirectory').mockReturnValue(mockParentDir as any);
      jest.spyOn(transactionalFileSystem as any, 'getOrCreateDirectory')
        .mockReturnValueOnce(mockSrcDir as any)
        .mockReturnValueOnce(mockDestDir as any);

      mockSrcDir.getExternalOperations.mockReturnValue([{ kind: 'move', oldDir: mockSrcDir, newDir: mockDestDir }]);

      expect(() => {
        transactionalFileSystem.queueCopyDirectory(srcPath, destPath);
      }).toThrow(errors.InvalidOperationError);
    });
  });
});

// End of unit tests for: queueCopyDirectory
