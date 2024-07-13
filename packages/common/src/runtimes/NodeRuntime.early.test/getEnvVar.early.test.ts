
// Unit tests for: getEnvVar








import { NodeRuntime } from '../NodeRuntime';


describe('NodeRuntime.getEnvVar() getEnvVar method', () => {
  let nodeRuntime: NodeRuntime;

  beforeEach(() => {
    nodeRuntime = new NodeRuntime();
  });

  describe('Happy Path', () => {
    test('should return the value of an existing environment variable', () => {
      // Arrange
      const envVarName = 'EXISTING_ENV_VAR';
      const envVarValue = 'some_value';
      process.env[envVarName] = envVarValue;

      // Act
      const result = nodeRuntime.getEnvVar(envVarName);

      // Assert
      expect(result).toBe(envVarValue);

      // Cleanup
      delete process.env[envVarName];
    });

    test('should return undefined for a non-existing environment variable', () => {
      // Arrange
      const envVarName = 'NON_EXISTING_ENV_VAR';

      // Act
      const result = nodeRuntime.getEnvVar(envVarName);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    test('should return undefined when environment variable name is an empty string', () => {
      // Arrange
      const envVarName = '';

      // Act
      const result = nodeRuntime.getEnvVar(envVarName);

      // Assert
      expect(result).toBeUndefined();
    });

    test('should return undefined when environment variable name is a whitespace string', () => {
      // Arrange
      const envVarName = '   ';

      // Act
      const result = nodeRuntime.getEnvVar(envVarName);

      // Assert
      expect(result).toBeUndefined();
    });

    test('should handle environment variable names with special characters', () => {
      // Arrange
      const envVarName = 'SPECIAL_CHAR_ENV_VAR!@#$%^&*()';
      const envVarValue = 'special_value';
      process.env[envVarName] = envVarValue;

      // Act
      const result = nodeRuntime.getEnvVar(envVarName);

      // Assert
      expect(result).toBe(envVarValue);

      // Cleanup
      delete process.env[envVarName];
    });

    test('should handle environment variable names with mixed case sensitivity', () => {
      // Arrange
      const envVarName = 'MixedCaseEnvVar';
      const envVarValue = 'mixed_case_value';
      process.env[envVarName] = envVarValue;

      // Act
      const result = nodeRuntime.getEnvVar(envVarName);

      // Assert
      expect(result).toBe(envVarValue);

      // Cleanup
      delete process.env[envVarName];
    });

    test.skip('should return undefined if process.env is undefined', () => {
      // Arrange
      const originalProcessEnv = process.env;
      process.env = undefined as any;

      // Act
      const result = nodeRuntime.getEnvVar('ANY_ENV_VAR');

      // Assert
      expect(result).toBeUndefined();

      // Cleanup
      process.env = originalProcessEnv;
    });
  });
});

// End of unit tests for: getEnvVar
