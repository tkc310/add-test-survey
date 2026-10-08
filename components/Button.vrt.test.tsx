import { composeStories } from "@storybook/react";
import { page } from "vitest/browser";
import { describe, expect, test } from "vitest";

import * as stories from "./Button.stories";

const { Primary, Danger, Disabled, DangerDisabled } = composeStories(stories);

/**
 * Button ストーリーをソースにしたビジュアルリグレッション
 */
describe("Button VRT", () => {
  test("Primary", async () => {
    await Primary.run();
    await expect(page.getByRole("button")).toMatchScreenshot("button-primary");
  });

  test("Danger", async () => {
    await Danger.run();
    await expect(page.getByRole("button")).toMatchScreenshot("button-danger");
  });

  test("Disabled", async () => {
    await Disabled.run();
    await expect(page.getByRole("button")).toMatchScreenshot("button-disabled");
  });

  test("DangerDisabled", async () => {
    await DangerDisabled.run();
    await expect(page.getByRole("button")).toMatchScreenshot("button-danger-disabled");
  });
});
