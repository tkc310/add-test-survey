import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 公式 Test Agents（planner / generator / healer）用の設定。
 * 既存の e2e/（playwright.config.ts）および e2e-agent/（TesterArmy）とは分離する。
 * CI および npm test からは呼ばない。
 */
export default defineConfig({
  testDir: './e2e-pw-agents',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
