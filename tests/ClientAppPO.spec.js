const { test, expect } = require('@playwright/test');
const {customtest} = require('../utils/test-base')
const { POManager } = require('../pageobjects/POManager')
const dataset = JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));

for (const data of dataset) 
{
    test(`@Web Client App login for ${data.productName}`, async ({ page }) => {

        const poManager = new POManager(page);
        const products = page.locator(".card-body");

        //Login
        const loginPage = poManager.getLoginPage();
        await loginPage.goto();
        await loginPage.validateLoginPage(data.username, data.password);

        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAddCart(data.productName);
        await dashboardPage.navigateToCart();

        const cartPage = poManager.getCartPage();
        await cartPage.VerifyProductIsDisplayed(data.productName);
        await cartPage.Checkout();

        const ordersReviewPage = poManager.getOrdersReviewPage();
        await ordersReviewPage.searchCountryAndSelect("ind", "India");
        const orderId = await ordersReviewPage.SubmitAndGetOrderId();
        console.log(orderId);
        await dashboardPage.navigateToOrders(); //
        const ordersHistoryPage = poManager.getOrdersHistoryPage();
        await ordersHistoryPage.searchOrderAndSelect(orderId);
        expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

    });

    customtest(`Client App checkout for ${data.productName}`, async ({ page,testDataForOrder }) => {

        const poManager = new POManager(page);
        const products = page.locator(".card-body");

        //Login
        const loginPage = poManager.getLoginPage();
        await loginPage.goto();
        await loginPage.validateLoginPage(testDataForOrder.username, testDataForOrder.password);

        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAddCart(testDataForOrder.productName);
        await dashboardPage.navigateToCart();

        const cartPage = poManager.getCartPage();
        await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
        await cartPage.Checkout();
    });

}