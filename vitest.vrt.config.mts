import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * アドホックなビジュアルリグレッション用 Vitest 設定。
 * Storybook の portable stories（composeStories）をソースにし、
 * Vitest Browser Mode の toMatchScreenshot で比較する。
 * 通常の unit / integration / CI からは分離する。
 */
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@storybook/react", "storybook/test", "react", "react-dom", "react/jsx-dev-runtime"],
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./"),
    },
  },
  test: {
    name: "vrt",
    include: ["components/**/*.vrt.test.{ts,tsx}"],
    setupFiles: ["./vitest.vrt.setup.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        {
          browser: "chromium",
          viewport: { width: 800, height: 600 },
        },
      ],
    },
  },
});
