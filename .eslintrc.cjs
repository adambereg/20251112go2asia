module.exports = {
  root: true,
  extends: ['./packages/config/eslint-config'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  ignorePatterns: ['node_modules', 'dist', 'build', '.next', '*.config.js', '*.config.ts'],
};

