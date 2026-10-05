import { test, expect } from '@playwright/test'

/**
 * タスク管理アプリのE2Eテスト
 * 
 * これらのテストは実際のユーザーフローを完全にテストする
 * Testing Trophyの頂点で、最も遅いが最も信頼性が高い
 * 重要なユーザーフローのみをテストする
 * 
 * 注: E2Eテストは少数で良い。ほとんどのロジックは統合テストとユニットテストでカバーする
 */

test.describe('タスク管理アプリ', () => {
  test('ページが正しく読み込まれ、基本要素が表示される', async ({ page }) => {
    await page.goto('/')

    // ページタイトルを確認
    await expect(page.getByRole('heading', { name: 'タスク管理アプリ' })).toBeVisible()
    
    // 説明文を確認
    await expect(page.getByText('Next.jsのテストベストプラクティスを学ぶためのサンプルアプリ')).toBeVisible()
    
    // フォーム要素が存在することを確認
    await expect(page.locator('input[placeholder="タスクを入力..."]')).toBeVisible()
    await expect(page.getByRole('button', { name: '追加' })).toBeVisible()
    
    // デフォルトのタスクが表示される
    await expect(page.getByText('Next.jsのテストを学ぶ')).toBeVisible()
    await expect(page.getByText('Vitestでユニットテストを書く')).toBeVisible()
  })

  test('タスクリストが正しく表示される', async ({ page }) => {
    await page.goto('/')

    // タスク一覧のヘッダーを確認
    await expect(page.getByRole('heading', { name: 'タスク一覧' })).toBeVisible()

    // デフォルトタスクのチェックボックスと削除ボタンを確認
    const checkboxes = page.getByRole('checkbox')
    expect(await checkboxes.count()).toBeGreaterThan(0)

    const deleteButtons = page.getByRole('button', { name: /削除/ })
    expect(await deleteButtons.count()).toBeGreaterThan(0)
  })

  test('アプリケーション全体の構造を確認', async ({ page }) => {
    await page.goto('/')

    // メインコンテンツが表示されることを確認
    await expect(page.locator('main')).toBeVisible()
    
    // 「このアプリについて」セクションが表示されることを確認
    const aboutSection = page.locator('text=このアプリについて').locator('..')
    await expect(aboutSection).toBeVisible()
    await expect(aboutSection.getByText('ユニットテスト', { exact: true })).toBeVisible()
    await expect(aboutSection.getByText('統合テスト', { exact: true })).toBeVisible()
    await expect(aboutSection.getByText('E2Eテスト', { exact: true })).toBeVisible()
  })
})
