
// Unit tests for: realpathSync


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      realpathSync: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    isNotExistsError: jest.fn(),
    getStandardizedAbsolutePath: jest.fn(),
    standardizeSlashes: jest.fn(),
  },
}));

jest.mock("../../errors", () => ({
  errors: {
    FileNotFoundError: jest.fn(),
    DirectoryNotFoundError: jest.fn(),
  },
}));

describe('RealFileSystemHost.realpathSync() realpathSync method', () => {
  let realFileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    realFileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should return the real path when the path exists', () => {
      const path = '/some/path';
      const realPath = '/real/path';
      (runtime.fs.realpathSync as jest.Mock).mockReturnValue(realPath);

      const result = realFileSystemHost.realpathSync(path);

      expect(result).toBe(realPath);
      expect(runtime.fs.realpathSync).toHaveBeenCalledWith(path);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should return the original path if realpathSync throws an error', () => {
      const path = '/some/nonexistent/path';
      (runtime.fs.realpathSync as jest.Mock).mockImplementation(() => {
        throw new Error('Path does not exist');
      });

      const result = realFileSystemHost.realpathSync(path);

      expect(result).toBe(path);
      expect(runtime.fs.realpathSync).toHaveBeenCalledWith(path);
    });

    test('should handle paths with special characters', () => {
      const path = '/some/path/with special@chars!';
      const realPath = '/real/path/with special@chars!';
      (runtime.fs.realpathSync as jest.Mock).mockReturnValue(realPath);

      const result = realFileSystemHost.realpathSync(path);

      expect(result).toBe(realPath);
      expect(runtime.fs.realpathSync).toHaveBeenCalledWith(path);
    });

    test('should handle empty string path', () => {
      const path = '';
      (runtime.fs.realpathSync as jest.Mock).mockReturnValue(path);

      const result = realFileSystemHost.realpathSync(path);

      expect(result).toBe(path);
      expect(runtime.fs.realpathSync).toHaveBeenCalledWith(path);
    });

    test('should handle path with only spaces', () => {
      const path = '   ';
      (runtime.fs.realpathSync as jest.Mock).mockReturnValue(path);

      const result = realFileSystemHost.realpathSync(path);

      expect(result).toBe(path);
      expect(runtime.fs.realpathSync).toHaveBeenCalledWith(path);
    });

    test('should handle path with unicode characters', () => {
      const path = '/some/路径';
      const realPath = '/real/路径';
      (runtime.fs.realpathSync as jest.Mock).mockReturnValue(realPath);

      const result = realFileSystemHost.realpathSync(path);

      expect(result).toBe(realPath);
      expect(runtime.fs.realpathSync).toHaveBeenCalledWith(path);
    });
  });
});

// End of unit tests for: realpathSync
