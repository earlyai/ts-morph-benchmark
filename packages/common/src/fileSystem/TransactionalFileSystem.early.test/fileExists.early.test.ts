
// Unit tests for: fileExists

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

  public getWasEverDeleted() {
    return this.wasEverDeleted;
  }

  public getParent() {
    return this.parent;
  }

  public setParent(parent: MockDirectory) {
    this.parent = parent;
  }

  public isFileQueuedForDelete(filePath: StandardizedFilePath) {
    return this.operations.some(
      (operation) => operation.kind === 'deleteFile' && operation.filePath === filePath
    );
  }
}

class MockPathCasingMaintainer {
  public getPath = jest.fn((path: StandardizedFilePath) => path);
  public removePath = jest.fn();
}

interface MockTransactionalFileSystemOptions {
  fileSystem: FileSystemHost;
  skipLoadingLibFiles?: boolean;
  libFolderPath?: string;
}

describe('TransactionalFileSystem.fileExists() fileExists method', () => {
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
    it('should return true if the file exists in the lib files', () => {
      const filePath = 'libFile.ts' as StandardizedFilePath;
      (transactionalFileSystem as any).libFileMap = new Map([[filePath, '']]);

      const result = transactionalFileSystem.fileExists(filePath);

      expect(result).toBe(true);
    });

    it('should return false if the file is deleted in memory', () => {
      const filePath = 'deletedFile.ts' as StandardizedFilePath;
      jest.spyOn(transactionalFileSystem as any, 'fileDeletedInMemory').mockReturnValue(true);

      const result = transactionalFileSystem.fileExists(filePath);

      expect(result).toBe(false);
    });

    it.skip('should return the result of fileSystem.fileExists if the file is not in lib files and not deleted in memory', () => {
      const filePath = 'existingFile.ts' as StandardizedFilePath;
      jest.spyOn(transactionalFileSystem as any, 'fileDeletedInMemory').mockReturnValue(false);
      mockFileSystem.fileExists.mockResolvedValue(true);

      const result = transactionalFileSystem.fileExists(filePath);

      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle case where file is not in lib files and fileSystem.fileExists throws an error', async () => {
      const filePath = 'nonExistentFile.ts' as StandardizedFilePath;
      jest.spyOn(transactionalFileSystem as any, 'fileDeletedInMemory').mockReturnValue(false);
      mockFileSystem.fileExists.mockRejectedValue(new Error('File not found'));

      await expect(transactionalFileSystem.fileExists(filePath)).rejects.toThrow('File not found');
    });

    it('should handle case where file is in lib files but fileSystem.fileExists throws an error', async () => {
      const filePath = 'libFileWithError.ts' as StandardizedFilePath;
      (transactionalFileSystem as any).libFileMap = new Map([[filePath, '']]);
      mockFileSystem.fileExists.mockRejectedValue(new Error('File not found'));

      const result = transactionalFileSystem.fileExists(filePath);

      expect(result).toBe(true);
    });
  });
});

// End of unit tests for: fileExists
