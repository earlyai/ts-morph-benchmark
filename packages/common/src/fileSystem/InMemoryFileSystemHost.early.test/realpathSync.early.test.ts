
// Unit tests for: realpathSync







import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

jest.mock("../../errors", () => {
  const actual = jest.requireActual("../../errors");
  return {
    ...actual,
    FileNotFoundError: jest.fn(),
    DirectoryNotFoundError: jest.fn(),
    PathNotFoundError: jest.fn(),
  };
});

jest.mock("../FileUtils", () => {
  const actual = jest.requireActual("../FileUtils");
  return {
    ...actual,
    getStandardizedAbsolutePath: jest.fn(),
    getDirPath: jest.fn(),
    getRelativePathTo: jest.fn(),
    pathJoin: jest.fn(),
    pathStartsWith: jest.fn(),
    getBaseName: jest.fn(),
  };
});

type MockStandardizedFilePath = string;


describe('InMemoryFileSystemHost.realpathSync() realpathSync method', () => {
  let fileSystemHost: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should return the same path when called with a valid path', () => {
      const path = '/valid/path' as MockStandardizedFilePath;
      const result = fileSystemHost.realpathSync(path);
      expect(result).toBe(path);
    });
  });

  describe('Edge Cases', () => {
    it('should return the same path when called with an empty string', () => {
      const path = '' as MockStandardizedFilePath;
      const result = fileSystemHost.realpathSync(path);
      expect(result).toBe(path);
    });

    it('should return the same path when called with a non-existent path', () => {
      const path = '/non/existent/path' as MockStandardizedFilePath;
      const result = fileSystemHost.realpathSync(path);
      expect(result).toBe(path);
    });

    it('should return the same path when called with a path containing special characters', () => {
      const path = '/path/with/special/!@#$%^&*()_+{}|:"<>?' as MockStandardizedFilePath;
      const result = fileSystemHost.realpathSync(path);
      expect(result).toBe(path);
    });

    it('should return the same path when called with a deeply nested path', () => {
      const path = '/a/very/deeply/nested/path/that/keeps/going/on/and/on' as MockStandardizedFilePath;
      const result = fileSystemHost.realpathSync(path);
      expect(result).toBe(path);
    });

    it('should return the same path when called with a path containing spaces', () => {
      const path = '/path/with spaces/in it' as MockStandardizedFilePath;
      const result = fileSystemHost.realpathSync(path);
      expect(result).toBe(path);
    });
  });
});

// End of unit tests for: realpathSync
