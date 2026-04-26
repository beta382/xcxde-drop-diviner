/// <reference types ="vitest/config" />
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { defineConfig, type UserConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const devPlugins = [];
  if (mode === "development") {
    const { i18nextHMRPlugin } = await import("i18next-hmr/vite");
    devPlugins.push(i18nextHMRPlugin({ localesDir: "./public/locales" }));
  }

  return {
    plugins: [
      react(),
      svgr(),
      babel({ presets: [reactCompilerPreset()] }),
      ...devPlugins,
    ],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    test: {
      coverage: {
        exclude: ["src/*.{ts,tsx}", "src/ui", "src/util/workers"],
        include: ["src/**/*.{ts,tsx}"],
        provider: "istanbul",
        thresholds: {
          branches: 92,
          functions: 97,
          statements: 97,
        },
      },
      globals: true,
    },
  } satisfies UserConfig;
});
