import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginReadableTailwind from "eslint-plugin-readable-tailwind";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslint from "@eslint/js";
import reactx from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ["dist", "**/._*"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["._*"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactx.configs.recommended,
      reactDom.configs.recommended,
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
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "readable-tailwind": eslintPluginReadableTailwind,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "react-x/prefer-shorthand-boolean": "warn",
      "react-dom/no-dangerously-set-innerhtml": "warn",
      ...eslintPluginReadableTailwind.configs.warning.rules,
      ...eslintPluginReadableTailwind.configs.error.rules,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  }
);
