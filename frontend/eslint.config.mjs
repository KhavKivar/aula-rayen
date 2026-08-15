import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "cloudflare-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
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

export default eslintConfig;
