import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    'packages/common/src'
  ],
  testRegex: '.*\\.test\\.ts$',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*/tests/**/*.ts',
    '!**/*/index.ts',
    '!**/*/types.d.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/', // Exclude node modules
  ],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/$1",
    '^@ts-morph/common$': '<rootDir>/node_modules/@ts-morph/common'
    
  }
};
export default config;


