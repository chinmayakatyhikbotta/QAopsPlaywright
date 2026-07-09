const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils');
const {
  getClientAppLoginPayload,
  getOrderPayload,
  hasClientAppCredentials,
} = require('../utils/env');

let response;

test.describe('@Smoke API + UI order verification', () => {
  test.skip(
    !hasClientAppCredentials(),
    'Set CLIENT_APP_EMAIL, CLIENT_APP_PASSWORD, and PRODUCT_ORDERED_ID in .env'
  );

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, getClientAppLoginPayload());
    response = await apiUtils.createOrder(getOrderPayload());
    expect(response.token).toBeTruthy();
    expect(response.orderId).toBeTruthy();
  });

  test('@API verify API-created order appears in order history', async ({
    page,
  }) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, response.token);

    await page.goto('/client');
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();

    const rows = page.locator('tbody tr');
    let orderFound = false;

    for (let i = 0; i < (await rows.count()); i++) {
      const rowOrderId = await rows.nth(i).locator('th').textContent();
      if (response.orderId.includes(rowOrderId)) {
        await rows.nth(i).locator('button').first().click();
        orderFound = true;
        break;
      }
    }

    expect(orderFound).toBeTruthy();
    const orderIdDetails = await page.locator('.col-text').textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
  });
});
