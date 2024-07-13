
// Unit tests for: getCurrentDirectory







import { InMemoryFileSystemHost } from '../InMemoryFileSystemHost';


// Mocking dependencies
jest.mock("../FileUtils", () => {
  const actual = jest.requireActual("../FileUtils");
  return {
    ...actual,
    getStandardizedAbsolutePath: jest.fn(),
    getDirPath: jest.fn(),
    getBaseName: jest.fn(),
    getRelativePathTo: jest.fn(),
    pathJoin: jest.fn(),
    pathStartsWith: jest.fn(),
  };
});

jest.mock("../matchGlobs", () => {
  const actual = jest.requireActual("../matchGlobs");
  return {
    ...actual,
    matchGlobs: jest.fn(),
  };
});

// Mock types
type MockStandardizedFilePath = string;


describe('InMemoryFileSystemHost.getCurrentDirectory() getCurrentDirectory method', () => {
  let fileSystemHost: InMemoryFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new InMemoryFileSystemHost();
  });

  describe('Happy Path', () => {
    it('should return the root directory', () => {
      // Test to ensure the method returns the root directory
      const result = fileSystemHost.getCurrentDirectory();
      expect(result).toBe('/');
    });
  });

  describe('Edge Cases', () => {
    it('should always return the root directory regardless of internal state', () => {
      // Test to ensure the method always returns the root directory
      // even if internal state changes
      fileSystemHost.mkdirSync('/test' as MockStandardizedFilePath);
      fileSystemHost.writeFileSync('/test/file.txt' as MockStandardizedFilePath, 'content');
      const result = fileSystemHost.getCurrentDirectory();
      expect(result).toBe('/');
    });
  });
});

// End of unit tests for: getCurrentDirectory
