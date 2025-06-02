export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        // '^.+\\.(css|scss|sass|less)$': 'jest-transform-stub',
        '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}", // Include all files
        "!src/**/*.d.ts",          // Exclude TypeScript declaration files
        "!src/**/index.{js,ts}",   // Exclude barrel files (optional)
        "!src/**/*.stories.{js,jsx,ts,tsx}", // Exclude Storybook
        '!src/__mocks__/**', // Exclude mocks
        '!src/types.ts',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/src/test-utils.tsx',
        '<rootDir>/src/test/', // this excludes the entire folder if needed
        '<rootDir>/src/vite-env.d.ts',
        '<rootDir>/src/utils/types.ts', // this excludes the entire folder if needed
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',  // Alias support
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/src/test/src/__mocks__/fileMock.js', // Mock static assets
    },
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    globals: {
        'import.meta.env': {
            VITE_API_URL: 'http://localhost:5176'  // Mock Vite env vars
        }
    },
};