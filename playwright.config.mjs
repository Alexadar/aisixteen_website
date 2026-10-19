// Cross-browser layout tests for the built site (docs/). Run: npm run test:layout
// CI runs every project; locally, run the browsers you have (e.g. --project=chromium).
import { defineConfig, devices } from '@playwright/test'

const PORT = 4317

export default defineConfig({
  testDir: 'tests',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'node scripts/serve-docs.mjs', url: `http://127.0.0.1:${PORT}/`, reuseExistingServer: !process.env.CI, env: { PORT: String(PORT) } },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
})
