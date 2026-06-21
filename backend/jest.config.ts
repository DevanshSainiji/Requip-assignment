import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',

  // Modern ts-jest v29 transform config (globals.ts-jest is deprecated)
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // Use the test tsconfig so Jest globals (describe, it, expect, etc.)
        // are ambient in every test and setup file.
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },

  // Only look inside src/tests/
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],

  // ── Environment ──────────────────────────────────────────────────────────────
  // Runs BEFORE any module is imported — sets DATABASE_URL to the test DB
  // so Prisma client connects to `requip_test_db`, not the dev DB.
  setupFiles: ['<rootDir>/src/tests/setEnv.ts'],

  // Runs AFTER Jest test framework is installed — can use beforeEach/afterAll.
  // Wipes the `users` table before every test for complete isolation.
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

  // ── Coverage ─────────────────────────────────────────────────────────────────
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',        // Bootstrap entry point — not exercisable in unit tests
    '!src/utils/swagger.ts', // Pure config, no branching logic
    '!src/tests/**/*',       // Test helpers are not production code
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
