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
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
      },
    },
    rules: {
      "import/no-unresolved": "error",
      "import/no-restricted-paths": [
        "error",
        {
          basePath: import.meta.dirname,
          zones: [
            {
              target: "./src/features",
              from: "./src/app",
              message: "Los features no pueden depender de la capa app.",
            },
            {
              target: [
                "./src/components",
                "./src/config",
                "./src/hooks",
                "./src/lib",
                "./src/testing",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
              message:
                "Los módulos compartidos no pueden depender de features ni app.",
            },
            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
              message: "Un feature no puede importar internals de otro feature.",
            },
          ],
        },
      ],
    },
  },
]);
