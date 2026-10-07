// spec: specs/task-basic.md
// seed: e2e-pw-agents/seed.spec.ts

import { test, expect } from '@playwright/test'

/**
 * generator が Markdown 計画から生成するテストの手書きサンプル。
 * 実際のエージェント実行なしでも、成果物の形と実行方法を確認できる。
 */
test.describe('タスクの基本操作', () => {
  test('有効なタスクを追加できる', async ({ page }) => {
    await page.goto('/')

    const title = `Playwright Test Agents サンプル ${Date.now()}`

    // 1. タスク入力欄にフォーカスする
    const taskInput = page.getByPlaceholder('タスクを入力...')
    await taskInput.click()

    // 2. タスク名を入力する
    await taskInput.fill(title)

    // 3. 追加ボタンを押す
    await page.getByRole('button', { name: '追加' }).click()

    // 期待結果:
    // - 入力したタスクが一覧に表示される
    await expect(page.getByText(title)).toBeVisible()

    // - 入力欄が空に戻る
    await expect(taskInput).toHaveValue('')
  })
})
