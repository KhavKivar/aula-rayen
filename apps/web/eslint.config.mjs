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
    rules: {},
  },
]);
