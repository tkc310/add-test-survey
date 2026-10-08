# Playwright Test Agents（アドホック）

[Playwright Test Agents](https://playwright.dev/docs/test-agents) は、公式が提供する 3 つのエージェントです。

- **planner** … アプリを探索し、Markdown のテスト計画を書く
- **generator** … 計画を実行可能な Playwright テストに落とす
- **healer** … 失敗したテストを直し、再実行する

このリポジトリでは **既存の Playwright スイートと TesterArmy e2e とは別系統** として置いています。CI では実行しません。クラウド VM や手元で、必要なときだけアドホックに使ってください。

## 既存スイートとの分離

| 項目                               | Playwright（既存）     | TesterArmy e2e          | Playwright Test Agents（本ドキュメント） |
| ---------------------------------- | ---------------------- | ----------------------- | ---------------------------------------- |
| 設定                               | `playwright.config.ts` | `e2e.config.ts`         | `playwright.agents.config.ts`            |
| テスト                             | `e2e/*.spec.ts`        | `e2e-agent/**/*.e2e.ts` | `e2e-pw-agents/**/*.spec.ts`             |
| 計画                               | （なし）               | （なし）                | `specs/*.md`                             |
| npm script                         | `test:e2e`             | `test:e2e:agent`        | `test:e2e:pw-agents`                     |
| 通常の `npm test`                  | 含む                   | **含まない**            | **含まない**                             |
| CI（`.github/workflows/test.yml`） | 実行する               | **実行しない**          | **実行しない**                           |

TesterArmy（`e2e` パッケージ / `agent.act`）とは別物です。こちらは `@playwright/test` の公式 `init-agents` が生成する planner / generator / healer 定義を使います。

## 初期化（エージェント定義の再生成）

Playwright を更新したら、公式どおり定義を再生成してください。

```bash
# 現行の Playwright では --loop=vscode は Copilot 系の定義を .github/agents/ に書く
npx playwright init-agents --loop=vscode -c playwright.agents.config.ts
```

このリポジトリでは CI に載せない方針のため、`init-agents` が作る `.github/workflows/copilot-setup-steps.yml` はコミットしていません。エージェント定義（`.github/agents/*.agent.md`）と VS Code MCP（`.vscode/mcp.json`）だけを残しています。

VS Code 向け chatmode が必要な場合は次です。

```bash
npx playwright init-agents --loop=vscode-legacy -c playwright.agents.config.ts
```

Claude Code 向けは `--loop=claude` です。この場合 `.mcp.json` を上書きすることがあるので、既存の TesterArmy MCP（`e2e`）とマージしてください。

## 前提

```bash
npm install --legacy-peer-deps
npx playwright install chromium
```

エージェント本体（planner / generator / healer）を動かすには、対応する AI コーディング環境（GitHub Copilot Coding Agent、VS Code、Claude Code など）が必要です。API キーや IDE の設定は各ツールの手順に従ってください。

## 成果物の置き場

| パス                                        | 内容                                                          |
| ------------------------------------------- | ------------------------------------------------------------- |
| `.github/agents/playwright-test-*.agent.md` | planner / generator / healer の定義                           |
| `.vscode/mcp.json`                          | `playwright-test` MCP（`npx playwright run-test-mcp-server`） |
| `specs/task-basic.md`                       | planner 出力を模したテスト計画サンプル                        |
| `e2e-pw-agents/seed.spec.ts`                | seed（環境の起点）                                            |
| `e2e-pw-agents/task-basic.spec.ts`          | generator 出力を模した実行可能なサンプル                      |
| `playwright.agents.config.ts`               | 本スイート専用の Playwright 設定                              |

## 実行

生成済みサンプルだけを確認する（AI エージェント不要）:

```bash
npm run test:e2e:pw-agents
```

または:

```bash
npx playwright test -c playwright.agents.config.ts
```

seed だけ:

```bash
npx playwright test -c playwright.agents.config.ts e2e-pw-agents/seed.spec.ts
```

開発サーバーは `playwright.agents.config.ts` の `webServer` が `npm run dev`（port 3100）を起動します。既に `http://localhost:3100` で動いていれば再利用します。

## エージェントの使い方（概要）

公式の流れは次のとおりです。

1. **planner** に「タスク追加フローの計画を書いて」と依頼し、`specs/` に Markdown を保存させる（seed: `e2e-pw-agents/seed.spec.ts`）
2. **generator** にその計画を渡し、`e2e-pw-agents/` 以下にテストを生成させる
3. 失敗したら **healer** に失敗テスト名を渡し、修正と再実行を任せる

プロンプト例や入出力の詳細は [公式ドキュメント](https://playwright.dev/docs/test-agents) を参照してください。
