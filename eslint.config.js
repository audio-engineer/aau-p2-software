// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.all,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
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
              name: ["User"],
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
