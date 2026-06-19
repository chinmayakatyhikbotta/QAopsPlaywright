const { defineConfig } = require('@playwright/test');
const { createAzurePlaywrightConfig, ServiceOS } = require('@azure/microsoft-playwright-testing');
const { DefaultAzureCredential } = require('@azure/identity');
const config = require('./playwright.config');

module.exports = defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    exposeNetwork: '<loopback>',
    connectTimeout: 3 * 60 * 1000,
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
  }),
  {
    timeout: 90 * 1000,         // increased from 30s for cloud runners
    expect: {
      timeout: 15 * 1000,       // increased from 5s for cloud runners
    },
    use: {
      actionTimeout: 30 * 1000,
      navigationTimeout: 60 * 1000,
    },
    retries: 2,                 // retry flaky tests on CI
    reporter: [
      ["html", { open: "never" }],
      ["@azure/playwright/reporter"],
    ],
  }
);