const base = require('@playwright/test');
const {APIUtils} = require('./APIUtils.js');
const { request } = require('@playwright/test');

const loginPayload = { userEmail: "mihil@gmail.com", userPassword: "Admin@123" };
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

exports.customTest = base.test.extend({

    autheticatedPage: async ({ browser }, use) => {

        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
        await page.locator("#userEmail").fill("mihil@gmail.com");
        await page.locator("#userPassword").fill("Admin@123");
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');
        await use(page);

        //tear down code
        //This code will run after the test is completed

    },

    createOrder: async ({}, use) => {
        const apiContext = await request.newContext();
        const apiUtils = new APIUtils(apiContext, loginPayload);
        const response = await apiUtils.createOrder(orderPayload);
        await use(response);
    }
})