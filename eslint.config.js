// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.all,
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: ["*.config.*", ".next/"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "StrictPascalCase"],
        },
      ],
      "@typescript-eslint/prefer-readonly-parameter-types": [
        "error",
        {
          allow: [
            "$",
            {
              from: "package",
              package: "@chatscope/use-chat",
              name: ["User", "ChatMessage"],
            },
            {
              from: "package",
              package: "@firebase/auth",
              name: ["User"],
            },
            {
              from: "package",
              package: "firebase/database",
              name: ["DataSnapshot"],
            },
            {
              from: "package",
              package: "@mui/x-data-grid",
              name: ["GridRenderCellParams"],
            },
            {
              from: "package",
              package: "react",
              name: ["ChangeEvent", "MouseEvent", "ReactNode"],
            },
            {
              from: "lib",
              name: ["Request"],
            },
          ],
        },
      ],
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: ["@mui/*/*/*"],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
