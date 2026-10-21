const {test, expect, request} = require('@playwright/test');
import { customTest } from '../utils/fixtures';

customTest("Fixture Demo", async ({ autheticatedPage,createOrder }) => {

    autheticatedPage.goto("https://rahulshettyacademy.com/client");
    await autheticatedPage.locator("button[routerlink*='myorders']").click();
    await autheticatedPage.locator("tbody").waitFor();
    await expect(autheticatedPage.getByText(createOrder.orderId)).toBeVisible();
    
})