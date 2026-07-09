// @ts-check
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.{js,ts}',
  testIgnore: [
    '**/ClientAppPO.spec.ts',
    '**/demo*.js',
    '**/demo*.ts',
    '**/NetworlTest2.spec.js',
    '**/Calendar.spec.js',
    '**/llc.spec.js',
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  expect: {
    timeout: process.env.CI ? 10_000 : 5_000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://rahulshettyacademy.com',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
