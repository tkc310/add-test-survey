# Lint / Format（oxlint / oxfmt）

このリポジトリの推奨パスは **oxlint（lint）と oxfmt（format）** です。日常の静的解析と整形はこちらを使います。

## 実行方法

```bash
npm run lint          # oxlint
npm run lint:fix      # oxlint の自動修正
npm run format        # oxfmt（書き込み）
npm run format:check  # oxfmt（差分チェックのみ）
```

設定ファイルはリポジトリ直下です。

- `.oxlintrc.json` … oxlint
- `.oxfmtrc.json` … oxfmt

CI（`.github/workflows/test.yml`）では `npm run lint` と `npm run format:check` を実行します。

## oxfmt のバージョン固定

`package.json` では oxfmt を `0.72.0` のように **厳密バージョン**で指定します（`^` / `~` は付けない）。

oxfmt は 0.x の minor 更新でも整形結果が変わることがある。範囲指定のままだと、依存更新のたびにリポジトリ全体の差分が発生しうるため、意図したバージョンへ明示的に上げる運用にする。

## `.git-blame-ignore-revs`

大規模な整形だけのコミットは、`.git-blame-ignore-revs` に SHA を登録している。ローカルで blame から除外するには次を実行する。

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

マージ方法によってはコミット SHA が変わる（squash merge など）。その場合は、マージ後の整形コミット SHA で `.git-blame-ignore-revs` を更新すること。

## ESLint / Prettier との関係

| ツール   | 状態                          | 扱い                                                                 |
| -------- | ----------------------------- | -------------------------------------------------------------------- |
| oxlint   | 推奨（`npm run lint`）        | 日常の lint                                                          |
| oxfmt    | 推奨（`npm run format`）      | 日常の format。Prettier は未導入のため競合なし                       |
| ESLint   | 併記（`npm run lint:eslint`） | Next.js / Storybook 向けルールの退避用。新規ルールは oxlint 側を優先 |
| Prettier | 未導入                        | 導入しない。フォーマットは oxfmt に寄せる                            |

ESLint（`eslint.config.mjs` と `eslint` / `eslint-config-next` / `eslint-plugin-storybook`）は、oxlint がまだカバーしきれない Storybook ルールなどを残すために一時的に併記しています。oxlint 側で十分になったら削除して一本化する想定です。

同じルールを ESLint と oxlint の両方で厳格に揃える必要はありません。衝突を避けるため、日々の実行は oxlint / oxfmt に寄せてください。
