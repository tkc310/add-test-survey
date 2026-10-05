# フロントエンドテストのベストプラクティス - サンプルリポジトリ

このリポジトリは、フロントエンドテストのベストプラクティスを実演するNext.jsサンプルアプリケーションです。Testing Trophyの概念に基づき、ユニット・統合・E2Eの3層でテストを構成し、AIエージェントがテストをフィードバックループとして使う方法を示します。

## テストレイヤーの構成

### 1. ユニットテスト

- 場所: `lib/*.test.ts`
- ツール: Vitest
- 対象: 純粋関数やロジック

```typescript
describe('validateEmail', () => {
  it('有効なメールアドレスを検証できる', () => {
    const result = validateEmail('test@example.com')
    expect(result.isValid).toBe(true)
  })
})
```

純粋関数は最も速くテストでき、リファクタリング時の安全網として機能します。

### 2. 統合テスト

- 場所: `components/*.test.tsx`
- ツール: Vitest + React Testing Library
- 対象: コンポーネントと依存関係の統合

```typescript
it('タスクを正常に作成できる', async () => {
  const user = userEvent.setup()
  render(<TaskForm />)
  
  await user.type(screen.getByPlaceholderText('タスクを入力...'), '新しいタスク')
  await user.click(screen.getByRole('button', { name: '追加' }))
  
  await waitFor(() => {
    expect(mockCreateTask).toHaveBeenCalledWith({ title: '新しいタスク' })
  })
})
```

実際のユーザー操作に近い形でコンポーネントをテストします。Testing Trophyの中核となる層です。

### 3. E2Eテスト

- 場所: `e2e/*.spec.ts`
- ツール: Playwright
- 対象: 重要なユーザーフロー全体

```typescript
test('タスクの作成、完了、削除', async ({ page }) => {
  await page.goto('/')
  
  await page.getByPlaceholder('タスクを入力...').fill('新しいタスク')
  await page.getByRole('button', { name: '追加' }).click()
  
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: /削除/ }).click()
})
```

実際のブラウザで実行され、クリティカルパスを保証します。

## Testing Trophyとは

Testing Trophyは、テストの適切なバランスを示すモデルです：

```
        /\
       /E2E\      ← 少数（重要フローのみ）
      /------\
     / Integration\  ← 中核（最も多く）
    /----------\
   /   Unit    \    ← 多数（純粋関数）
  /------------\
 / Static Analysis \ ← TypeScript/ESLint
```

推奨するテストの割合は次のとおりです：
- Static Analysis（TypeScript、ESLint）で型チェックと静的解析
- Unit Tests（40-50%）で純粋関数をテスト
- Integration Tests（40-50%）でコンポーネントの統合をテスト
- E2E Tests（5-10%）で重要なユーザーフローのみテスト

## セットアップと実行

### 初期セットアップ

```bash
npm install --legacy-peer-deps
npx playwright install chromium
```

### テスト実行

```bash
npm test                  # すべてのテスト
npm run test:unit         # ユニットテストのみ
npm run test:integration  # 統合テストのみ
npm run test:e2e          # E2Eテストのみ
npm run test:watch        # ウォッチモード（開発中）
```

### 開発サーバー

```bash
npm run dev
```

http://localhost:3100 でアクセスできます。

## AIエージェントとテストの使い方

AIエージェント（Cursor、GitHub Copilotなど）を使う際のワークフローを3つ示します。

### TDD（テスト駆動開発）

1. 要件を理解
2. テストを先に書く（AIに書かせる）
3. 実装を書く（AIに書かせる）
4. テストを実行して確認
5. 失敗したら修正を指示

指示例：

```
ユーザー名のバリデーション関数を作りたい。
条件：2文字以上、20文字以下、半角英数字のみ。
まずユニットテストを書いて、その後実装してください。
```

### 既存コードの変更

1. 変更したい機能を説明
2. 既存のテストを確認
3. 実装を変更（AIに依頼）
4. テストを実行
5. 失敗したテストを確認して修正を指示

指示例：

```
TaskFormコンポーネントに文字数カウンターを追加したい。
既存のテストが通るように実装し、新しい機能のテストも追加してください。
```

### リファクタリング

1. リファクタリングしたいコードを特定
2. まずテストがすべて通ることを確認
3. リファクタリングを実行（AIに依頼）
4. テストを再実行
5. すべて通ればOK、失敗したら修正

指示例：

```
lib/validation.tsのコードを、よりモダンで読みやすいスタイルにリファクタリングしてください。
すべてのテストが引き続き通るようにしてください。
```

### テスト結果の読み方

すべて通過した場合：

```
✓ lib/validation.test.ts (12 tests)
✓ components/TaskForm.test.tsx (6 tests)
✓ components/TaskList.test.tsx (6 tests)
✓ e2e/app.spec.ts (6 tests)

Total: 30 tests passed
```

実装が正しく動作しています。次の機能に進めます。

ユニットテストが失敗した場合：

```
✗ lib/validation.test.ts
  ✗ validateEmail
    Expected: true
    Received: false
```

ロジックに問題があります。AIに「validateEmail関数のロジックを修正してください」と指示します。

統合テストが失敗した場合：

```
✗ components/TaskForm.test.tsx
  ✗ タスクを正常に作成できる
    Error: mockCreateTask was not called
```

コンポーネントとServer Actionsの統合に問題があります。AIに「TaskFormでcreateTaskが呼ばれていません。修正してください」と指示します。

E2Eテストが失敗した場合：

```
✗ e2e/app.spec.ts
  ✗ 新しいタスクを作成できる
    Timeout: locator.click: Timeout 30000ms exceeded
```

UIまたは全体のフローに問題があります。AIに「E2Eテストでボタンがクリックできません。UIの実装を確認してください」と指示します。

## テストレイヤーの選び方

ユニットテストを書く対象：
- 純粋関数（入力→出力が明確）
- バリデーション、計算、フォーマット処理
- 複雑なビジネスロジック

統合テストを書く対象：
- UIコンポーネント
- ユーザーインタラクション
- コンポーネント間の連携
- フォーム送信

E2Eテストを書く対象：
- 重要なユーザーフロー（登録、ログイン、決済など）
- 複数ページにまたがる操作
- ビジネス上クリティカルな機能

E2Eテストはすべての機能に書くと遅くなります。細かいバリデーションはユニットテストで済ませます。

## プロジェクト構造

```
.
├── app/                    # Next.js App Router
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   ├── TaskForm.tsx
│   ├── TaskForm.test.tsx  # 統合テスト
│   ├── TaskList.tsx
│   └── TaskList.test.tsx  # 統合テスト
├── lib/                   # ビジネスロジック
│   ├── actions.ts         # Server Actions
│   ├── types.ts           # 型定義
│   ├── validation.ts      # バリデーション関数
│   └── validation.test.ts # ユニットテスト
├── e2e/                   # E2Eテスト
│   └── app.spec.ts
├── vitest.config.ts       # Vitest設定
├── vitest.setup.ts        # Vitestセットアップ
├── playwright.config.ts   # Playwright設定
└── .github/workflows/     # CI設定
    └── test.yml
```

## CI/CD

GitHub Actionsでテストが自動実行されます：

- プッシュ時とPR作成時に自動実行
- ユニット → 統合 → E2E の順に実行
- 失敗した場合、Playwrightのレポートがアップロードされます

## 参考リソース

- [Testing Library](https://testing-library.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Testing Trophy by Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

## ライセンス

学習目的で作成されています。自由に使用・改変してください。
