import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const alias = {
  "@": path.resolve(dirname, "./"),
};

/**
 * ユニット（Node）と統合（happy-dom + RTL）を projects で分離する。
 * VRT は vitest.vrt.config.mts でアドホック実行するため、ここには含めない。
 */
export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          include: ["lib/**/*.test.{ts,tsx}"],
          environment: "node",
        },
      },
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: "integration",
          include: ["components/**/*.test.{ts,tsx}"],
          // VRT は別設定で実行する
          exclude: ["**/*.vrt.test.{ts,tsx}"],
          environment: "happy-dom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
