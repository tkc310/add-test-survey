# ビジュアルリグレッションテスト（VRT）

Storybook の Button / TaskForm ストーリーを `composeStories`（portable stories）で読み込み、Vitest Browser Mode の `toMatchScreenshot` で見た目の差分を検出します。CI では実行しません。必要なときだけアドホックに走らせてください。

## 前提

```bash
npm install --legacy-peer-deps
npx playwright install chromium
```

ベースライン画像は **Linux + Chromium**（Cursor クラウド VM など）で揃える想定です。OS やフォントが違うと差分が出やすいので、更新も同じ環境で行ってください。

## 実行

```bash
# 比較（ベースラインが無ければ新規作成して失敗する）
npm run test:vrt

# ベースラインを作り直す / 意図した変更を取り込む
npm run test:vrt:update
```

対象ファイル:

- `components/Button.vrt.test.tsx` … `Button.stories.tsx` を compose
- `components/TaskForm.vrt.test.tsx` … `TaskForm.stories.tsx` を compose（`play` で入力状態を再現）
- 設定: `vitest.vrt.config.mts` / `vitest.vrt.setup.ts`

通常の `npm test` / `test:unit` / `test:integration` / CI ワークフローには含まれません。

## ベースラインの置き場

```
components/__screenshots__/
  Button.vrt.test.tsx/
  TaskForm.vrt.test.tsx/
```

Vitest 既定どおり、テストファイル隣の `__screenshots__` に PNG が置かれます。ファイル名にはブラウザ名などが含まれます（例: `*-chromium-linux.png`）。

- **コミットする**: `__screenshots__` 内のベースライン PNG
- **コミットしない**: 差分出力（`.gitignore` で `*-diff.png` / `*-actual.png` などを除外）

## ベースラインの更新手順

1. UI 変更後、クラウド VM などで `npm run test:vrt` を実行し、意図しない差分がないか確認する
2. 意図した見た目変更だけなら `npm run test:vrt:update` でベースラインを更新する
3. 新しい PNG をレビューしてコミットする

## Storybook 上での状態確認

```bash
npm run storybook
```

`Components/TaskForm` の各ストーリーは Interactions パネルで `play` による入力・フォーカス・送信前後を確認できます。
