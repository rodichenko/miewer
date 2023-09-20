module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'xo',
    'xo-typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'padding-line-between-statements': 'off',
    '@typescript-eslint/padding-line-between-statements': 'off',
    'no-console': 'off',
  },
  root: true,
  ignorePatterns: [
    'misc/**/*',
    '.*rc.json',
    '.*rc.js',
    '*.config.js',
    'build-stats/**/*',
  ],
  overrides: [
    {
      files: ['src/**/*.test.{js,jsx,ts,tsx}'],
      env: {
        'jest/globals': true,
      },
      plugins: ['jest'],
    },
  ],
};
