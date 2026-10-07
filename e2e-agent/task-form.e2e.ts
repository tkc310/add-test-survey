import { test } from '@e2e-dev/web'
import { expect } from 'e2e'

/**
 * screen / expect による deterministic サンプル（API キー不要）。
 * Playwright の e2e/*.spec.ts と同系統のフローを、e2e ランナー上で書く例。
 */
test('見出しとタスク追加フォームが表示される', async ({ app, screen }) => {
  await app.open('/')

  await expect(screen.getByRole('heading', 'タスク管理アプリ')).toBeVisible()
  await expect(screen.getByPlaceholder('タスクを入力...')).toBeVisible()
  await expect(screen.getByRole('button', '追加')).toBeVisible()
})

test('タスクを追加すると一覧に表示される', async ({ app, screen }) => {
  await app.open('/')

  const title = `e2e-agent サンプル ${Date.now()}`
  await screen.getByPlaceholder('タスクを入力...').fill(title)
  await screen.getByRole('button', '追加').tap()

  await expect(screen.getByText(title)).toBeVisible()
})
