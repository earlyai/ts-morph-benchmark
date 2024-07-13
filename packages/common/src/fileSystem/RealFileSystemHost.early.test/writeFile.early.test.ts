
// Unit tests for: writeFile


import { runtime } from "../../runtimes";



import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      writeFile: jest.fn(),
      writeFileSync: jest.fn(),
    },
  },
}));

describe('RealFileSystemHost.writeFile() writeFile method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy Path', () => {
    test('should write file successfully with valid file path and content', async () => {
      const filePath = 'path/to/file.txt';
      const fileText = 'Hello, World!';
      (runtime.fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(fileSystemHost.writeFile(filePath, fileText)).resolves.toBeUndefined();
      expect(runtime.fs.writeFile).toHaveBeenCalledWith(filePath, fileText);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty file path', async () => {
      const filePath = '';
      const fileText = 'Hello, World!';
      (runtime.fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(fileSystemHost.writeFile(filePath, fileText)).resolves.toBeUndefined();
      expect(runtime.fs.writeFile).toHaveBeenCalledWith(filePath, fileText);
    });

    test('should handle empty file content', async () => {
      const filePath = 'path/to/file.txt';
      const fileText = '';
      (runtime.fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(fileSystemHost.writeFile(filePath, fileText)).resolves.toBeUndefined();
      expect(runtime.fs.writeFile).toHaveBeenCalledWith(filePath, fileText);
    });

    test('should handle special characters in file path', async () => {
      const filePath = 'path/to/special!@#$%^&*()_+file.txt';
      const fileText = 'Hello, World!';
      (runtime.fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(fileSystemHost.writeFile(filePath, fileText)).resolves.toBeUndefined();
      expect(runtime.fs.writeFile).toHaveBeenCalledWith(filePath, fileText);
    });

    test('should handle very large file content', async () => {
      const filePath = 'path/to/largefile.txt';
      const fileText = 'a'.repeat(10 * 1024 * 1024); // 10 MB of 'a'
      (runtime.fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(fileSystemHost.writeFile(filePath, fileText)).resolves.toBeUndefined();
      expect(runtime.fs.writeFile).toHaveBeenCalledWith(filePath, fileText);
    });

    test('should throw error if writeFile fails', async () => {
      const filePath = 'path/to/file.txt';
      const fileText = 'Hello, World!';
      const error = new Error('Failed to write file');
      (runtime.fs.writeFile as jest.Mock).mockRejectedValueOnce(error);

      await expect(fileSystemHost.writeFile(filePath, fileText)).rejects.toThrow('Failed to write file');
      expect(runtime.fs.writeFile).toHaveBeenCalledWith(filePath, fileText);
    });
  });
});

// End of unit tests for: writeFile
