# TesterArmy e2e（アドホック）

[TesterArmy e2e](https://tester.army/e2e) は、Playwright 上に載る TypeScript の E2E ランナーです。`agent.act` / `agent.assert` のような自然言語ステップと、`screen` / `expect` による deterministic な操作を同じテストに混ぜられます。

このリポジトリでは **既存の Playwright スイートとは別系統** として置いています。CI では実行しません。クラウド VM や手元で、必要なときだけアドホックに走らせてください。

## 既存 Playwright との分離

| 項目 | Playwright（既存） | TesterArmy e2e（本ドキュメント） |
| --- | --- | --- |
| 設定 | `playwright.config.ts` | `e2e.config.ts` |
| テスト | `e2e/*.spec.ts` | `e2e-agent/**/*.e2e.ts` |
| npm script | `test:e2e` | `test:e2e:agent` |
| 通常の `npm test` | 含む | **含まない** |
| CI（`.github/workflows/test.yml`） | 実行する | **実行しない** |

`@e2e-dev/web` は独自の `playwright-core` をピン留めするため、既存の `@playwright/test` と同居できます。

## 前提

公式のエンジン要件は **Node.js 24.8 以上**（Node.js 22 系なら **22.22.3 以上**）です。このリポジトリの CI は Node 24 を使いますが、e2e スイート自体は CI に載せていません。ローカル／クラウド VM でアドホック実行する想定です。

```bash
# Node 要件を満たしたうえで
npm install --legacy-peer-deps

# e2e 用ブラウザ（初回）
npx playwright install chromium
```

モデルを使うサンプルには、利用するプロバイダの API キーが必要です。デフォルト設定は Vercel AI Gateway（`AI_GATEWAY_API_KEY`）です。キーが無くても、deterministic サンプルだけでセットアップの確認ができます。

## 実行

```bash
# deterministic のみ（API キー不要）
npm run test:e2e:agent:deterministic

# スイート全体（agent サンプルを含む。キーが無いと agent 側は失敗する）
npm run test:e2e:agent

# エージェントサンプルだけ（キー必須）
AI_GATEWAY_API_KEY=... npm run test:e2e:agent -- e2e-agent/agent-sample.e2e.ts

# 公式 CLI そのまま
npx e2e run
npx e2e run e2e-agent/app-opens.e2e.ts
```

開発サーバーは `e2e.config.ts` の `app.command` が `npm run dev`（port 3100）を起動します。既に `http://localhost:3100` で動いていれば再利用します。

ベース URL を変えたいときは次のようにします。

```bash
APP_URL=http://localhost:3100 npm run test:e2e:agent:deterministic
```

## サンプルの置き場

- `e2e-agent/app-opens.e2e.ts` … 起動確認（キー不要）
- `e2e-agent/task-form.e2e.ts` … `screen` / `expect` で見出し・フォーム・タスク追加（キー不要）
- `e2e-agent/agent-sample.e2e.ts` … `agent.act` / `agent.assert`（キー必須）
- `e2e.config.ts` … ターゲット・エージェント・テスト glob

コーディングエージェント向けの skill は `.agents/skills/e2e/` にあります（`.claude/skills/e2e` はそこへの symlink）。MCP 登録は `.cursor/mcp.json` と `.mcp.json` です。詳細は `npx e2e guide` を参照してください。

## 成果物と gitignore

実行成果は `.e2e/` 以下に出ます。`.gitignore` で artifacts / cache / report などを除外しています。agent ステップのリプレイキャッシュをチームで共有したい場合だけ、公式ドキュメントに従って `.e2e/cache/` のコミットを検討してください。
