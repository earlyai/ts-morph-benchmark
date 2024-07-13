
// Unit tests for: readFileIfExistsSync



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
  // Mock properties and methods as needed
}

class MockPathCasingMaintainer {
  // Mock properties and methods as needed
}

interface MockTransactionalFileSystemOptions {
  // Mock properties and methods as needed
}

class MockFileSystemHost implements FileSystemHost {
  isCaseSensitive = jest.fn();
  delete = jest.fn();
  deleteSync = jest.fn();
  readDirSync = jest.fn();
  readFile = jest.fn();
  readFileSync = jest.fn();
  writeFile = jest.fn();
  writeFileSync = jest.fn();
  mkdir = jest.fn();
  mkdirSync = jest.fn();
  move = jest.fn();
  moveSync = jest.fn();
  copy = jest.fn();
  copySync = jest.fn();
  fileExists = jest.fn();
  fileExistsSync = jest.fn();
  directoryExists = jest.fn();
  directoryExistsSync = jest.fn();
  realpathSync = jest.fn();
  getCurrentDirectory = jest.fn();
  glob = jest.fn();
  globSync = jest.fn();
}

describe('TransactionalFileSystem.readFileIfExistsSync() readFileIfExistsSync method', () => {
  let mockFileSystemHost: MockFileSystemHost;
  let transactionalFileSystem: TransactionalFileSystem;

  beforeEach(() => {
    mockFileSystemHost = new MockFileSystemHost();
    transactionalFileSystem = new TransactionalFileSystem(mockFileSystemHost as any);
  });

  describe('Happy Path', () => {
    test.skip('should return file content when file exists', () => {
      const filePath = 'some/path' as StandardizedFilePath;
      const encoding = 'utf-8';
      const fileContent = 'file content';

      mockFileSystemHost.readFileSync.mockReturnValue(fileContent as any);

      const result = transactionalFileSystem.readFileIfExistsSync(filePath, encoding);

      expect(result).toBe(fileContent);
      expect(mockFileSystemHost.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });

    test.skip('should return undefined when file is deleted in memory', () => {
      const filePath = 'some/path' as StandardizedFilePath;
      const encoding = 'utf-8';

      jest.spyOn(transactionalFileSystem, 'fileDeletedInMemory' as any).mockReturnValue(true);

      const result = transactionalFileSystem.readFileIfExistsSync(filePath, encoding);

      expect(result).toBeUndefined();
      expect(mockFileSystemHost.readFileSync).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
//    test('should return undefined when file does not exist', () => {
//      const filePath = 'some/path' as StandardizedFilePath;
//      const encoding = 'utf-8';
//
//      mockFileSystemHost.readFileSync.mockImplementation(() => {
//        throw new errors.FileNotFoundError();
//      });
//
//      const result = transactionalFileSystem.readFileIfExistsSync(filePath, encoding);
//
//      expect(result).toBeUndefined();
//      expect(mockFileSystemHost.readFileSync).toHaveBeenCalledWith(filePath, encoding);
//    });

    test.skip('should throw error for non-FileNotFoundError exceptions', () => {
      const filePath = 'some/path' as StandardizedFilePath;
      const encoding = 'utf-8';
      const error = new Error('Some other error');

      mockFileSystemHost.readFileSync.mockImplementation(() => {
        throw error;
      });

      expect(() => {
        transactionalFileSystem.readFileIfExistsSync(filePath, encoding);
      }).toThrow(error);
      expect(mockFileSystemHost.readFileSync).toHaveBeenCalledWith(filePath, encoding);
    });
  });
});

// End of unit tests for: readFileIfExistsSync
