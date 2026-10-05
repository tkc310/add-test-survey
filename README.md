# フロントエンドテストのベストプラクティス - サンプルリポジトリ

このリポジトリは、AIドリブンな開発のためのフロントエンドテストのベストプラクティスを実演するNext.jsサンプルアプリケーションです。

## 🎯 目的

このプロジェクトは、**Testing Trophy**（テストトロフィー）の概念に基づいて、適切なテストレイヤーの使い分けを実演します。AIコーディングエージェントがテストをフィードバックループとして活用する方法を示します。

## 📚 テストレイヤーの構成

### 1. ユニットテスト（Unit Tests）
- **場所**: `lib/*.test.ts`
- **ツール**: Vitest
- **目的**: 純粋関数やロジックのテスト
- **実行速度**: ⚡ 最速
- **推奨量**: 📊 最多

**例**: `lib/validation.test.ts`
```typescript
// バリデーション関数のテスト
describe('validateEmail', () => {
  it('有効なメールアドレスを検証できる', () => {
    const result = validateEmail('test@example.com')
    expect(result.isValid).toBe(true)
  })
})
```

**なぜこのテストが重要か**:
- 純粋関数は最も速くテストできる
- ロジックの正確性を保証
- リファクタリング時の安全網として機能

### 2. 統合テスト（Integration Tests）
- **場所**: `components/*.test.tsx`
- **ツール**: Vitest + React Testing Library
- **目的**: コンポーネントとその依存関係の統合テスト
- **実行速度**: 🏃 中速
- **推奨量**: 📊 中量（Testing Trophyの中核）

**例**: `components/TaskForm.test.tsx`
```typescript
// フォームコンポーネントとServer Actionsの統合テスト
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

**なぜこのテストが重要か**:
- 実際のユーザー操作に近い形でテスト
- コンポーネント間の統合をテスト
- UIとロジックの統合を保証

### 3. E2Eテスト（End-to-End Tests）
- **場所**: `e2e/*.spec.ts`
- **ツール**: Playwright
- **目的**: 重要なユーザーフロー全体のテスト
- **実行速度**: 🐌 最遅
- **推奨量**: 📊 最少（重要フローのみ）

**例**: `e2e/app.spec.ts`
```typescript
// 完全なユーザーフローのテスト
test('完全なユーザーフロー: タスクの作成、完了、削除', async ({ page }) => {
  await page.goto('/')
  
  // タスクを作成
  await page.getByPlaceholder('タスクを入力...').fill('新しいタスク')
  await page.getByRole('button', { name: '追加' }).click()
  
  // タスクを完了
  await page.getByRole('checkbox').check()
  
  // タスクを削除
  await page.getByRole('button', { name: /削除/ }).click()
})
```

**なぜこのテストが重要か**:
- 実際のブラウザで実行される
- ユーザーが経験する通りにアプリをテスト
- クリティカルパスの保証

## 🧪 Testing Trophy とは

Testing Trophy（テストトロフィー）は、テストの適切なバランスを示すモデルです：

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

### 各層の推奨バランス

- **Static Analysis**: TypeScript、ESLintで型チェックと静的解析
- **Unit Tests**: 純粋関数のテスト（40-50%）
- **Integration Tests**: コンポーネントとその統合のテスト（40-50%）
- **E2E Tests**: 重要なユーザーフローのみ（5-10%）

## 🚀 セットアップと実行

### 初期セットアップ

```bash
# 依存関係をインストール
npm install --legacy-peer-deps

# Playwrightブラウザをインストール
npx playwright install chromium
```

### テスト実行

```bash
# すべてのテストを実行
npm test

# ユニットテストのみ
npm run test:unit

# 統合テストのみ
npm run test:integration

# E2Eテストのみ
npm run test:e2e

# ウォッチモード（開発中）
npm run test:watch
```

### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3100 でアプリケーションにアクセスできます。

## 🤖 AIコーディングエージェントの活用方法

### テストをフィードバックループとして使用する

AIエージェント（Cursor、GitHub Copilot、その他のLLMベースのツール）を使用する際の推奨ワークフロー：

#### 1. **TDD（テスト駆動開発）スタイル**

```
1. 要件を理解
   ↓
2. テストを先に書く（AIに書かせる）
   ↓
3. 実装を書く（AIに書かせる）
   ↓
4. テストを実行して確認
   ↓
5. 失敗したら修正を指示
```

**AIへの指示例**:
```
「ユーザー名のバリデーション関数を作りたい。
条件：2文字以上、20文字以下、半角英数字のみ。
まずユニットテストを書いて、その後実装してください。」
```

#### 2. **既存コードの変更**

```
1. 変更したい機能を説明
   ↓
2. 既存のテストを確認
   ↓
3. 実装を変更（AIに依頼）
   ↓
4. テストを実行
   ↓
5. 失敗したテストを確認して修正を指示
```

**AIへの指示例**:
```
「TaskFormコンポーネントに文字数カウンターを追加したい。
既存のテストが通るように実装し、新しい機能のテストも追加してください。」
```

#### 3. **リファクタリング**

```
1. リファクタリングしたいコードを特定
   ↓
2. まずテストがすべて通ることを確認
   ↓
3. リファクタリングを実行（AIに依頼）
   ↓
4. テストを再実行
   ↓
5. すべて通ればOK、失敗したら修正
```

**AIへの指示例**:
```
「lib/validation.tsのコードを、よりモダンで読みやすいスタイルにリファクタリングしてください。
ただし、すべてのテストが引き続き通るようにしてください。」
```

### テスト結果の読み方

#### ✅ すべてのテストが通過
```
✓ lib/validation.test.ts (12 tests)
✓ components/TaskForm.test.tsx (6 tests)
✓ components/TaskList.test.tsx (6 tests)
✓ e2e/app.spec.ts (6 tests)

Total: 30 tests passed
```
→ **実装が正しく動作しています。次の機能に進めます。**

#### ❌ ユニットテストが失敗
```
✗ lib/validation.test.ts
  ✗ validateEmail
    Expected: true
    Received: false
```
→ **ロジックに問題があります。AIに「validateEmail関数のロジックを修正してください」と指示**

#### ❌ 統合テストが失敗
```
✗ components/TaskForm.test.tsx
  ✗ タスクを正常に作成できる
    Error: mockCreateTask was not called
```
→ **コンポーネントとServer Actionsの統合に問題があります。AIに「TaskFormでcreateTaskが呼ばれていません。修正してください」と指示**

#### ❌ E2Eテストが失敗
```
✗ e2e/app.spec.ts
  ✗ 新しいタスクを作成できる
    Timeout: locator.click: Timeout 30000ms exceeded
```
→ **UIまたは全体のフローに問題があります。AIに「E2Eテストでボタンがクリックできません。UIの実装を確認してください」と指示**

## 📊 テストの書き方ガイドライン

### どのテストレイヤーを選ぶべきか？

#### ユニットテストを書く場合
- ✅ 純粋関数（入力→出力が明確）
- ✅ バリデーション、計算、フォーマット処理
- ✅ 複雑なビジネスロジック
- ❌ UIコンポーネント
- ❌ API呼び出しを含む処理

#### 統合テストを書く場合
- ✅ UIコンポーネント
- ✅ ユーザーインタラクション
- ✅ コンポーネント間の連携
- ✅ フォーム送信
- ❌ 簡単すぎるコンポーネント（ボタンのみなど）
- ❌ アプリ全体のフロー

#### E2Eテストを書く場合
- ✅ 重要なユーザーフロー（登録、ログイン、決済など）
- ✅ 複数ページにまたがる操作
- ✅ ビジネス上クリティカルな機能
- ❌ すべての機能（遅くなりすぎる）
- ❌ 細かいバリデーション（ユニットテストで十分）

## 🔧 プロジェクト構造

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

## 🎓 学習のポイント

1. **テストピラミッドではなくトロフィー**: 統合テストを中心に据える
2. **ユーザー視点でテスト**: 実装の詳細ではなく、ユーザーの体験をテストする
3. **速いフィードバック**: ユニットテストで素早くイテレーション
4. **重要な部分だけE2E**: すべてをE2Eでテストしない
5. **AIとの協働**: テストを使ってAIの出力を検証する

## 🚀 CI/CD

GitHub Actionsで自動テストが実行されます：

- プッシュ時とPR作成時に自動実行
- ユニット → 統合 → E2E の順に実行
- 失敗した場合、Playwrightのレポートがアップロードされる

## 📖 参考リソース

- [Testing Library](https://testing-library.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Testing Trophy by Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

## 📝 ライセンス

このプロジェクトは学習目的で作成されています。自由に使用・改変してください。
