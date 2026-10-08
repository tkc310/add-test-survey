import type { E2EConfig } from "e2e";
import { web } from "@e2e-dev/web";
import { gateway } from "ai";

/**
 * TesterArmy e2e（https://tester.army/e2e）の設定。
 * 既存の Playwright スイート（playwright.config.ts / e2e/*.spec.ts）とは別ランナー。
 *
 * - テスト配置: e2e-agent/ 配下の *.e2e.ts
 * - 実行: npm run test:e2e:agent （CI では実行しない）
 * - Node.js 24.8+（または 22.22.3+）が必要
 * - agent.* ステップには AI_GATEWAY_API_KEY（または利用するプロバイダのキー）が必要
 */
export default {
  tests: "e2e-agent/**/*.e2e.ts",
  targets: [
    {
      name: "web",
      engine: web({ browser: "chromium" }),
      app: {
        // Next.js 16 の dev は localhost で起動するため、127.0.0.1 ではなく localhost を使う
        url: process.env.APP_URL ?? "http://localhost:3100",
        command: {
          executable: "npm",
          args: ["run", "dev"],
          log: ".e2e/logs/app.log",
          reuseExisting: true,
        },
      },
    },
  ],
  // agent.act / agent.assert 用。キー無しでも deterministic テストは実行できる
  agents: {
    default: {
      model: gateway("openai/gpt-6-luna-fast"),
      system: "You are a thorough QA agent. Verify every outcome on screen.",
      context:
        "This is a Japanese task management demo. The main heading is タスク管理アプリ. The add button label is 追加.",
    },
  },
} satisfies E2EConfig;
