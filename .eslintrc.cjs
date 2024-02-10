module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/all",
    "next/core-web-vitals",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "StrictPascalCase"],
      },
    ],
  },
  ignorePatterns: ["postcss.config.js"],
};
