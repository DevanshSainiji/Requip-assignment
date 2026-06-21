import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Only look inside src/tests/
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],

  // Run tests serially — avoids port/DB conflicts between test files
  runInBand: true,

  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',       // entry point — not testable in unit tests
    '!src/utils/swagger.ts', // doc config — no logic to test
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
