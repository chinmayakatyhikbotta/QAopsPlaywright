const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils');
const {
  getClientAppLoginPayload,
  getOrderPayload,
  hasClientAppCredentials,
} = require('../utils/env');

const fakePayLoadOrders = { data: [], message: 'No Orders' };

let response;

test.describe('@API network mocking', () => {
  test.skip(
    !hasClientAppCredentials(),
    'Set CLIENT_APP_EMAIL, CLIENT_APP_PASSWORD, and PRODUCT_ORDERED_ID in .env'
  );

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, getClientAppLoginPayload());
    response = await apiUtils.createOrder(getOrderPayload());
  });

  test('@API shows empty state when orders API response is mocked', async ({
    page,
  }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, response.token);

    await page.route('**/api/ecom/order/get-orders-for-customer/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakePayLoadOrders),
      });
    });

    await page.goto('/client');
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse('**/api/ecom/order/get-orders-for-customer/**');

    await expect(page.locator('.mt-4')).toContainText('No Orders');
  });
});
