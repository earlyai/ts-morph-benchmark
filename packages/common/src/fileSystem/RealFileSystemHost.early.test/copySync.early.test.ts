
// Unit tests for: copySync

import { errors } from "../../errors";

import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      copySync: jest.fn(),
      readFileSync: jest.fn(),
      writeFileSync: jest.fn(),
      statSync: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    getStandardizedAbsolutePath: jest.fn((host, path) => path),
    pathJoin: jest.fn((...paths) => paths.join('/')),
    isNotExistsError: jest.fn(),
  },
}));

describe('RealFileSystemHost.copySync() copySync method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test.skip('should copy a file from source to destination', () => {
      const srcPath = 'src/file.txt';
      const destPath = 'dest/file.txt';
      const fileContent = 'file content';

      (runtime.fs.readFileSync as jest.Mock).mockReturnValue(fileContent);
      (runtime.fs.statSync as jest.Mock).mockReturnValue({ isFile: () => true });

      fileSystemHost.copySync(srcPath, destPath);

      expect(runtime.fs.readFileSync).toHaveBeenCalledWith(srcPath, 'utf-8');
      expect(runtime.fs.writeFileSync).toHaveBeenCalledWith(destPath, fileContent);
    });

//    test('should copy a directory from source to destination', () => {
//      const srcPath = 'src/dir';
//      const destPath = 'dest/dir';
//
//      (runtime.fs.statSync as jest.Mock).mockReturnValue({ isFile: () => false, isDirectory: () => true });
//      (fileSystemHost as any).#directories = new Set([srcPath]);
//
//      fileSystemHost.copySync(srcPath, destPath);
//
//      expect(runtime.fs.copySync).toHaveBeenCalledWith(srcPath, destPath);
//    });
  });

  describe('Edge Cases', () => {
    test.skip('should throw PathNotFoundError if source path does not exist', () => {
      const srcPath = 'nonexistent/file.txt';
      const destPath = 'dest/file.txt';

      (runtime.fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(true);

      expect(() => fileSystemHost.copySync(srcPath, destPath)).toThrow(errors.PathNotFoundError);
    });

    test.skip('should handle symbolic links correctly', () => {
      const srcPath = 'src/symlink';
      const destPath = 'dest/symlink';

      (runtime.fs.statSync as jest.Mock).mockReturnValue({ isFile: () => false, isDirectory: () => false, isSymlink: () => true });
      (runtime.fs.readFileSync as jest.Mock).mockReturnValue('symlink content');

      fileSystemHost.copySync(srcPath, destPath);

      expect(runtime.fs.readFileSync).toHaveBeenCalledWith(srcPath, 'utf-8');
      expect(runtime.fs.writeFileSync).toHaveBeenCalledWith(destPath, 'symlink content');
    });

//    test('should handle nested directories correctly', () => {
//      const srcPath = 'src/dir';
//      const destPath = 'dest/dir';
//
//      (runtime.fs.statSync as jest.Mock).mockReturnValue({ isFile: () => false, isDirectory: () => true });
//      (fileSystemHost as any).#directories = new Set([srcPath, 'src/dir/nested']);
//
//      fileSystemHost.copySync(srcPath, destPath);
//
//      expect(runtime.fs.copySync).toHaveBeenCalledWith(srcPath, destPath);
//      expect(runtime.fs.copySync).toHaveBeenCalledWith('src/dir/nested', 'dest/dir/nested');
//    });
  });
});

// End of unit tests for: copySync
