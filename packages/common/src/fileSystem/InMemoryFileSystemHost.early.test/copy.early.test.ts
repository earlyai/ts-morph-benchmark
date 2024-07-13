
// Unit tests for: copy

import { errors } from "../../errors";






import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

type MockStandardizedFilePath = string;


describe('InMemoryFileSystemHost.copy() copy method', () => {
  let fileSystem: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystem = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should copy a file from source to destination', () => {
      const srcPath = '/src/file.txt' as MockStandardizedFilePath;
      const destPath = '/dest/file.txt' as MockStandardizedFilePath;
      const fileContent = 'Hello, World!';

      fileSystem.writeFileSync(srcPath, fileContent);

      fileSystem.copySync(srcPath, destPath);

      expect(fileSystem.readFileSync(destPath)).toBe(fileContent);
    });

    it('should copy a directory from source to destination', () => {
      const srcDir = '/src' as MockStandardizedFilePath;
      const destDir = '/dest' as MockStandardizedFilePath;
      const filePath = '/src/file.txt' as MockStandardizedFilePath;
      const fileContent = 'Hello, World!';

      fileSystem.mkdirSync(srcDir);
      fileSystem.writeFileSync(filePath, fileContent);

      fileSystem.copySync(srcDir, destDir);

      expect(fileSystem.directoryExistsSync(destDir)).toBe(true);
      expect(fileSystem.readFileSync('/dest/file.txt' as MockStandardizedFilePath)).toBe(fileContent);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the source path does not exist', () => {
      const srcPath = '/nonexistent/file.txt' as MockStandardizedFilePath;
      const destPath = '/dest/file.txt' as MockStandardizedFilePath;

      expect(() => fileSystem.copySync(srcPath, destPath)).toThrow(errors.PathNotFoundError);
    });

    it('should overwrite the destination file if it already exists', () => {
      const srcPath = '/src/file.txt' as MockStandardizedFilePath;
      const destPath = '/dest/file.txt' as MockStandardizedFilePath;
      const srcContent = 'Source Content';
      const destContent = 'Destination Content';

      fileSystem.writeFileSync(srcPath, srcContent);
      fileSystem.writeFileSync(destPath, destContent);

      fileSystem.copySync(srcPath, destPath);

      expect(fileSystem.readFileSync(destPath)).toBe(srcContent);
    });

    it('should handle copying an empty directory', () => {
      const srcDir = '/src' as MockStandardizedFilePath;
      const destDir = '/dest' as MockStandardizedFilePath;

      fileSystem.mkdirSync(srcDir);

      fileSystem.copySync(srcDir, destDir);

      expect(fileSystem.directoryExistsSync(destDir)).toBe(true);
      expect(fileSystem.readDirSync(destDir)).toEqual([]);
    });

    it('should copy nested directories and files', () => {
      const srcDir = '/src' as MockStandardizedFilePath;
      const nestedDir = '/src/nested' as MockStandardizedFilePath;
      const filePath = '/src/nested/file.txt' as MockStandardizedFilePath;
      const destDir = '/dest' as MockStandardizedFilePath;
      const fileContent = 'Nested File Content';

      fileSystem.mkdirSync(srcDir);
      fileSystem.mkdirSync(nestedDir);
      fileSystem.writeFileSync(filePath, fileContent);

      fileSystem.copySync(srcDir, destDir);

      expect(fileSystem.directoryExistsSync('/dest/nested' as MockStandardizedFilePath)).toBe(true);
      expect(fileSystem.readFileSync('/dest/nested/file.txt' as MockStandardizedFilePath)).toBe(fileContent);
    });
  });
});

// End of unit tests for: copy
