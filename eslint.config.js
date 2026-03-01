import js from "@eslint/js";
import ts from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default ts.config(
  {
    ignores: ["dist", "node_modules", ".deploy", "infra", "pi-src", "docker"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...ts.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
      "no-case-declarations": "warn",
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "warn",
      "no-empty": "warn",
      "no-inner-declarations": "warn",
      "no-constant-condition": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-namespace": "warn",
      "no-async-promise-executor": "warn",
      "no-extra-boolean-cast": "warn",
      "no-prototype-builtins": "warn",
      "no-regex-spaces": "warn",
      "no-useless-backreference": "warn",
      "no-useless-catch": "warn",
      "no-useless-escape": "warn",
      "no-shadow-restricted-names": "warn",
      "no-sparse-arrays": "warn",
      "no-with": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "@typescript-eslint/no-unnecessary-type-constraint": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
  {
    files: ["apps/api/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
