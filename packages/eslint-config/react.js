import base from './base.js'

/**
 * eslint configuration for react.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default {
  ...base,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parserOptions: {
    project: ['./tsconfig.json', '../../packages/typescript-config/vite-react.json'],
    tsconfigRootDir: '.'
  },
  settings: { react: { version: 'detect' } },
  env: { browser: true }
}