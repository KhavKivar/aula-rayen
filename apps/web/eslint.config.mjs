import eslintPluginImport from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "dist/**",
    ".next/**",
    ".open-next/**",
    ".tanstack/**",
    ".wrangler/**",
    "build/**",
    "cloudflare-env.d.ts",
    "src/routeTree.gen.ts",
  ]),
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  eslintPluginImport.flatConfigs.recommended,
  {
    files: ["eslint.config.mjs"],
    rules: {
      "import/no-unresolved": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx,mts}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: new URL("./tsconfig.json", import.meta.url).pathname,
        },
      },
    },
    rules: {
      "no-console": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/features/admin-dashboard",
              from: "./src/features/auth",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/admin-dashboard",
              from: "./src/features/course-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/admin-dashboard",
              from: "./src/features/course-management",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/admin-dashboard",
              from: "./src/features/landing",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/auth",
              from: "./src/features/admin-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/auth",
              from: "./src/features/course-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/auth",
              from: "./src/features/course-management",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/auth",
              from: "./src/features/landing",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-dashboard",
              from: "./src/features/admin-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-dashboard",
              from: "./src/features/auth",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-dashboard",
              from: "./src/features/course-management",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-dashboard",
              from: "./src/features/landing",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-management",
              from: "./src/features/admin-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-management",
              from: "./src/features/auth",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-management",
              from: "./src/features/course-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/course-management",
              from: "./src/features/landing",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/landing",
              from: "./src/features/admin-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/landing",
              from: "./src/features/auth",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/landing",
              from: "./src/features/course-dashboard",
              message: "No importes entre features. Compón desde routes.",
            },
            {
              target: "./src/features/landing",
              from: "./src/features/course-management",
              message: "No importes entre features. Compón desde routes.",
            },
          ],
        },
      ],
    },
  },
]);
