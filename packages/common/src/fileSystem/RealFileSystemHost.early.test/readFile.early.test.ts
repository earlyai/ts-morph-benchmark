
// Unit tests for: readFile

import { errors } from "../../errors";

import { runtime } from "../../runtimes";


import { FileUtils } from "../FileUtils";

import { RealFileSystemHost } from '../RealFileSystemHost';


jest.mock("../../runtimes", () => ({
  runtime: {
    fs: {
      readFile: jest.fn(),
    },
  },
}));

jest.mock("../FileUtils", () => ({
  FileUtils: {
    isNotExistsError: jest.fn(),
    getStandardizedAbsolutePath: jest.fn(),
  },
}));

describe('RealFileSystemHost.readFile() readFile method', () => {
  let fileSystemHost: RealFileSystemHost;

  beforeEach(() => {
    fileSystemHost = new RealFileSystemHost();
  });

  describe('Happy path', () => {
    test('should read a file successfully with default encoding', async () => {
      const filePath = 'test.txt';
      const fileContent = 'Hello, world!';
      (runtime.fs.readFile as jest.Mock).mockResolvedValue(fileContent);

      const result = await fileSystemHost.readFile(filePath);

      expect(runtime.fs.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
      expect(result).toBe(fileContent);
    });

    test('should read a file successfully with specified encoding', async () => {
      const filePath = 'test.txt';
      const encoding = 'ascii';
      const fileContent = 'Hello, world!';
      (runtime.fs.readFile as jest.Mock).mockResolvedValue(fileContent);

      const result = await fileSystemHost.readFile(filePath, encoding);

      expect(runtime.fs.readFile).toHaveBeenCalledWith(filePath, encoding);
      expect(result).toBe(fileContent);
    });
  });

  describe('Edge cases', () => {
    test('should throw a FileNotFoundError if the file does not exist', async () => {
      const filePath = 'nonexistent.txt';
      const error = new Error('File not found');
      (runtime.fs.readFile as jest.Mock).mockRejectedValue(error);
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(true);
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(filePath);

      await expect(fileSystemHost.readFile(filePath)).rejects.toThrow(errors.FileNotFoundError);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, filePath);
    });

    test('should rethrow the error if it is not a file not found error', async () => {
      const filePath = 'test.txt';
      const error = new Error('Some other error');
      (runtime.fs.readFile as jest.Mock).mockRejectedValue(error);
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(false);

      await expect(fileSystemHost.readFile(filePath)).rejects.toThrow(error);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
    });

    test('should handle empty file path gracefully', async () => {
      const filePath = '';
      const error = new Error('File not found');
      (runtime.fs.readFile as jest.Mock).mockRejectedValue(error);
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(true);
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(filePath);

      await expect(fileSystemHost.readFile(filePath)).rejects.toThrow(errors.FileNotFoundError);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, filePath);
    });

    test('should handle null file path gracefully', async () => {
      const filePath = null as unknown as string;
      const error = new Error('File not found');
      (runtime.fs.readFile as jest.Mock).mockRejectedValue(error);
      (FileUtils.isNotExistsError as jest.Mock).mockReturnValue(true);
      (FileUtils.getStandardizedAbsolutePath as jest.Mock).mockReturnValue(filePath);

      await expect(fileSystemHost.readFile(filePath)).rejects.toThrow(errors.FileNotFoundError);
      expect(FileUtils.isNotExistsError).toHaveBeenCalledWith(error);
      expect(FileUtils.getStandardizedAbsolutePath).toHaveBeenCalledWith(fileSystemHost, filePath);
    });
  });
});

// End of unit tests for: readFile
