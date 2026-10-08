import { test, expect } from "@playwright/test";

/**
 * Playwright Test Agents 用の seed テスト。
 * planner / generator が環境を起動し、生成テストの雛形として参照する。
 * 公式ドキュメント: https://playwright.dev/docs/test-agents
 */
test.describe("seed", () => {
  test("seed", async ({ page }) => {
    // アプリのトップへ移動し、エージェント探索の起点を用意する
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "タスク管理アプリ" })).toBeVisible();
  });
});
