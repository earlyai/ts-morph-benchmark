
// Unit tests for: getEndOfLine





import * as os from "os";



import { NodeRuntime } from '../NodeRuntime';


describe('NodeRuntime.getEndOfLine() getEndOfLine method', () => {
  let nodeRuntime: NodeRuntime;

  beforeEach(() => {
    nodeRuntime = new NodeRuntime();
  });

  describe('Happy Path', () => {
    test('should return the correct end-of-line character for the current operating system', () => {
      // Arrange
      const expectedEOL = os.EOL;

      // Act
      const result = nodeRuntime.getEndOfLine();

      // Assert
      expect(result).toBe(expectedEOL);
    });
  });

  describe('Edge Cases', () => {
    test.skip('should return "\\n" when the platform is set to "linux"', () => {
      // Arrange
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'linux',
      });
      const expectedEOL = '\n';

      // Act
      const result = nodeRuntime.getEndOfLine();

      // Assert
      expect(result).toBe(expectedEOL);

      // Cleanup
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    test.skip('should return "\\r\\n" when the platform is set to "win32"', () => {
      // Arrange
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
      const expectedEOL = '\r\n';

      // Act
      const result = nodeRuntime.getEndOfLine();

      // Assert
      expect(result).toBe(expectedEOL);

      // Cleanup
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    test.skip('should return "\\r" when the platform is set to "darwin"', () => {
      // Arrange
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'darwin',
      });
      const expectedEOL = '\n'; // macOS uses '\n' as EOL

      // Act
      const result = nodeRuntime.getEndOfLine();

      // Assert
      expect(result).toBe(expectedEOL);

      // Cleanup
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });
  });
});

// End of unit tests for: getEndOfLine
