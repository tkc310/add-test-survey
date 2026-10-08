import { test } from "@e2e-dev/web";
import { expect } from "e2e";

/**
 * agent.act / agent.assert を使うサンプル。
 *
 * 実行にはモデル API キーが必要（例: AI_GATEWAY_API_KEY）。
 * キーが無い環境ではこのファイルを指定せず、deterministic 側だけ走らせること。
 *
 *   npm run test:e2e:agent:deterministic
 *   AI_GATEWAY_API_KEY=... npm run test:e2e:agent -- e2e-agent/agent-sample.e2e.ts
 */
test("エージェントがタスク追加フローを駆動する", async ({ app, agent, screen }) => {
  await app.open("/");

  await agent.act("タスク入力欄に「エージェント追加タスク」と入力し、追加ボタンを押す");
  await agent.assert("タスク一覧に「エージェント追加タスク」が表示されている");

  await expect(screen.getByText("エージェント追加タスク")).toBeVisible();
});
