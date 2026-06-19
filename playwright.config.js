const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  testMatch: '**/*.spec.js',
  retries: process.env.CI ? 2 : 0,
  timeout: process.env.CI ? 90_000 : 30_000,
  expect: {
    timeout: process.env.CI ? 15_000 : 5_000,
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },
};

module.exports = config;