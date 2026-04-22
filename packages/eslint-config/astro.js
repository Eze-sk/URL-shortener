import base from './base.js'

/**
 * eslint configuration for astro.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default {
  ...base,
  extends: [
    'eslint:recommended',
    'plugin:astro/recommended',
    'prettier'
  ],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        project: ['./tsconfig.json', '../../packages/typescript-config/astro-preact.json'],
        tsconfigRootDir: '.'
      },
      rules: {
        'semi': ['error', 'never']
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      extends: ['preact'],
      parserOptions: {
        project: ['./tsconfig.json', '../../packages/typescript-config/astro-preact.json'],
        tsconfigRootDir: '.'
      },
      rules: {
        'semi': ['error', 'never']
      }
    }
  ]
}