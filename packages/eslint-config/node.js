import base from './base.js'

/**
 * eslint configuration for node.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default {
  ...base,
  env: { node: true },
  parserOptions: {
    project: ['./tsconfig.json', '../../packages/typescript-config/bun-express.json'],
    tsconfigRootDir: '.'
  },
  rules: {
    ...base.rules,
    'no-console': 'warn'
  }
}