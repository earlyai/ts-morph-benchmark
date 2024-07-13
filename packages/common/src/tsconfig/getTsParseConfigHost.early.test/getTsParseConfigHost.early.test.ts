
// Unit tests for: getTsParseConfigHost



import { readDirectory } from "../readDirectory";

import { GetTsParseConfigHostOptions, getTsParseConfigHost } from '../getTsParseConfigHost';


jest.mock("../readDirectory", () => {
  const actual = jest.requireActual("../readDirectory");
  return {
    ...actual,
    readDirectory: jest.fn(),
  };
});

class MockTransactionalFileSystem {
  public fileExistsSync = jest.fn();
  public getStandardizedAbsolutePath = jest.fn();
  public readFileSync = jest.fn();
}

describe('getTsParseConfigHost() getTsParseConfigHost method', () => {
  let mockFileSystem: MockTransactionalFileSystem;
  let options: GetTsParseConfigHostOptions;

  beforeEach(() => {
    mockFileSystem = new MockTransactionalFileSystem();
    options = { encoding: 'utf-8' };
  });

  describe('Happy Path', () => {
    it('should return a host with the correct properties and methods', () => {
      const host = getTsParseConfigHost(mockFileSystem as any, options);

      expect(host.useCaseSensitiveFileNames).toBe(false);
      expect(typeof host.readDirectory).toBe('function');
      expect(typeof host.fileExists).toBe('function');
      expect(typeof host.readFile).toBe('function');
      expect(typeof host.getDirectories).toBe('function');
      expect(typeof host.clearDirectories).toBe('function');
    });

    it('should read directory and store directories', () => {
      const mockDirectories = ['dir1', 'dir2'];
      const mockFiles = ['file1.ts', 'file2.ts'];
      (readDirectory as jest.Mock).mockReturnValue({ directories: mockDirectories, files: mockFiles });

      const host = getTsParseConfigHost(mockFileSystem as any, options);
      const result = host.readDirectory('rootDir', ['.ts'], [], [], 1);

      expect(result).toEqual(mockFiles);
      expect(host.getDirectories()).toEqual(mockDirectories);
    });

    it('should check if file exists', () => {
      mockFileSystem.fileExistsSync.mockReturnValue(true);
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue('standardizedPath');

      const host = getTsParseConfigHost(mockFileSystem as any, options);
      const result = host.fileExists('somePath');

      expect(result).toBe(true);
      expect(mockFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith('somePath');
      expect(mockFileSystem.fileExistsSync).toHaveBeenCalledWith('standardizedPath');
    });

    it('should read file with correct encoding', () => {
      const mockContent = 'file content';
      mockFileSystem.readFileSync.mockReturnValue(mockContent);
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue('standardizedPath');

      const host = getTsParseConfigHost(mockFileSystem as any, options);
      const result = host.readFile('somePath');

      expect(result).toBe(mockContent);
      expect(mockFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith('somePath');
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith('standardizedPath', 'utf-8');
    });

    it('should clear directories', () => {
      const mockDirectories = ['dir1', 'dir2'];
      (readDirectory as jest.Mock).mockReturnValue({ directories: mockDirectories, files: [] });

      const host = getTsParseConfigHost(mockFileSystem as any, options);
      host.readDirectory('rootDir', ['.ts'], [], [], 1);
      expect(host.getDirectories()).toEqual(mockDirectories);

      host.clearDirectories();
      expect(host.getDirectories()).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty directory results', () => {
      (readDirectory as jest.Mock).mockReturnValue({ directories: [], files: [] });

      const host = getTsParseConfigHost(mockFileSystem as any, options);
      const result = host.readDirectory('rootDir', ['.ts'], [], [], 1);

      expect(result).toEqual([]);
      expect(host.getDirectories()).toEqual([]);
    });

    it('should handle non-existent files gracefully', () => {
      mockFileSystem.fileExistsSync.mockReturnValue(false);
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue('standardizedPath');

      const host = getTsParseConfigHost(mockFileSystem as any, options);
      const result = host.fileExists('nonExistentPath');

      expect(result).toBe(false);
      expect(mockFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith('nonExistentPath');
      expect(mockFileSystem.fileExistsSync).toHaveBeenCalledWith('standardizedPath');
    });

    it('should handle readFile errors gracefully', () => {
      mockFileSystem.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });
      mockFileSystem.getStandardizedAbsolutePath.mockReturnValue('standardizedPath');

      const host = getTsParseConfigHost(mockFileSystem as any, options);

      expect(() => host.readFile('somePath')).toThrow('File read error');
      expect(mockFileSystem.getStandardizedAbsolutePath).toHaveBeenCalledWith('somePath');
      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith('standardizedPath', 'utf-8');
    });
  });
});

// End of unit tests for: getTsParseConfigHost
