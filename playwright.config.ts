import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.APP_URL || 'http://localhost:3000';
const appUrl = new URL(baseURL);
const port = appUrl.port || '3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --hostname ${appUrl.hostname} --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
