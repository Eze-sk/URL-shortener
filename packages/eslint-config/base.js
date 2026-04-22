/**
 * eslint base configuration.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default {
  env: { node: true, es2022: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single']
  }
}