import { test } from "@e2e-dev/web";
import { expect } from "e2e";

/**
 * モデル API キー不要の deterministic サンプル。
 * アプリが起動し、トップページが表示されることだけを確認する。
 */
test("アプリが開き body が表示される", async ({ app, browser }) => {
  await app.open("/");
  await expect(browser.locator("body")).toBeVisible();
});
