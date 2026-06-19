const { defineConfig } = require('@playwright/test');
const { createAzurePlaywrightConfig, ServiceOS } = require('@azure/playwright');
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
    timeout: 90 * 1000,
    expect: {
      timeout: 15 * 1000,
    },
    use: {
      actionTimeout: 30 * 1000,
      navigationTimeout: 60 * 1000,
    },
    retries: 2,
    reporter: [
      ["html", { open: "never" }],
      ["@azure/playwright/reporter"],
    ],
  }
);