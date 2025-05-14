export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        // '^.+\\.(css|scss|sass|less)$': 'jest-transform-stub',
        // '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}", // Include all files
        "!src/**/*.d.ts",          // Exclude TypeScript declaration files
        "!src/**/index.{js,ts}",   // Exclude barrel files (optional)
        "!src/**/*.stories.{js,jsx,ts,tsx}", // Exclude Storybook
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',  // Alias support
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
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