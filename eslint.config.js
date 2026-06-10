import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // argsIgnorePattern covers capitalized destructured params (e.g.
      // `({ icon: Icon }) => <Icon />`) — used in JSX, which base
      // no-unused-vars can't see without eslint-plugin-react.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Node contexts: serverless functions, build scripts, configs, tests
    files: ['api/**/*.js', 'prerender.mjs', 'vite.config.js', 'vite.ssr.config.js', '**/*.test.{js,jsx}', 'vitest.setup.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Fast-refresh boundary exceptions:
    // - CartContext intentionally exports the useCart hook alongside the
    //   provider (standard React context pattern)
    // - entry-server exports a render() function and is never hot-reloaded
    //   (build-time SSR only)
    files: ['src/context/CartContext.jsx', 'src/entry-server.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
