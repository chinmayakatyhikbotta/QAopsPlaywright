const base = require('@playwright/test');
const {
  getClientAppCredentials,
  getDefaultProductName,
  hasClientAppCredentials,
} = require('./env');

exports.customtest = base.test.extend({
  testDataForOrder: async ({}, use) => {
    if (!hasClientAppCredentials()) {
      throw new Error(
        'Set CLIENT_APP_EMAIL and CLIENT_APP_PASSWORD in .env before running fixture-based tests.'
      );
    }

    const { userEmail, userPassword } = getClientAppCredentials();
    await use({
      username: userEmail,
      password: userPassword,
      productName: getDefaultProductName(),
    });
  },
});
