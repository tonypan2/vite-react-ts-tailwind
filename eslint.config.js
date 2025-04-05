import js from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginReadableTailwind from 'eslint-plugin-readable-tailwind'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  {
    ignores: ['dist', '**/._*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['._*'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'readable-tailwind': eslintPluginReadableTailwind,
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic,
      '@stylistic/jsx': stylisticJsx,
    },
    rules: {
      '@stylistic/jsx/jsx-sort-props': 1,
      ...eslintPluginReadableTailwind.configs.warning.rules,
      ...eslintPluginReadableTailwind.configs.error.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
)
