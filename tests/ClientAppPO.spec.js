const { test, expect } = require('@playwright/test');
const { customtest } = require('../utils/test-base');
const { POManager } = require('../pageobjects/POManager');
const {
  getClientAppCredentials,
  hasClientAppCredentials,
} = require('../utils/env');

const dataset = JSON.parse(
  JSON.stringify(require('../utils/placeorderTestData.json'))
);

async function placeOrderE2E(page, credentials, productName) {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(credentials.userEmail, credentials.userPassword);

  const dashboardPage = poManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(productName);
  await dashboardPage.navigateToCart();

  const cartPage = poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(productName);
  await cartPage.Checkout();

  const ordersReviewPage = poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect('ind', 'India');
  const orderId = await ordersReviewPage.SubmitAndGetOrderId();

  await dashboardPage.navigateToOrders();
  const ordersHistoryPage = poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(orderId);

  expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  return orderId;
}

test.describe('@Smoke Client App E2E', () => {
  test.skip(
    !hasClientAppCredentials(),
    'Set CLIENT_APP_EMAIL and CLIENT_APP_PASSWORD in .env'
  );

  for (const data of dataset) {
    test(`@Web place order for ${data.productName}`, async ({ page }) => {
      const credentials = getClientAppCredentials();
      await placeOrderE2E(page, credentials, data.productName);
    });
  }
});

customtest('@Smoke @Web Client App order via fixture', async ({
  page,
  testDataForOrder,
}) => {
  const credentials = {
    userEmail: testDataForOrder.username,
    userPassword: testDataForOrder.password,
  };
  await placeOrderE2E(page, credentials, testDataForOrder.productName);
});
