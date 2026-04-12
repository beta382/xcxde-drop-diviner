import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["coverage", "dist", "wasm-rs"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsdoc.configs["flat/recommended-typescript-error"],
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      jsdoc,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ regex: "^@mui/[^/]+$" }],
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-restricted-types": [
        "error",
        {
          types: {
            Omit: {
              message: "Use `Except` from `type-fest` instead",
              fixWith: "Except",
            },
            Extract: {
              message: "Use `ExtractStrict` from `type-fest` instead",
              fixWith: "ExtractStrict",
            },
            Exclude: {
              message: "Use `ExcludeStrict` from `type-fest` instead",
              fixWith: "ExcludeStrict",
            },
          },
        },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: "only-allowed-literals",
        },
      ],
      "@typescript-eslint/strict-boolean-expressions": "error",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-returns": ["error", { checkGetters: false }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
    },
  },
]);
