module.exports = {
  // Use ts-jest preset to transform TypeScript and TSX files
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // Updated: Point to setup file instead of package directly
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  
  moduleNameMapper: {
    // Mock CSS and static assets
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    // Path alias used in the project (@/* -> src/*)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  transformIgnorePatterns: ['/node_modules/'],
};