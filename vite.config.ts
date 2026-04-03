/// <reference types ="vitest/config" />
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      "~": "./src",
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
});
