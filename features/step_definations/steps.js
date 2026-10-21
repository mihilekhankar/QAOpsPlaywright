const { When, Then, Given, After } = require('@cucumber/cucumber');
const { POManager } = require('../../pageobjects/POManager');
const { expect, chromium } = require('@playwright/test');

Given('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 1000 }, async function (username, password) {
    const products = this.page.locator(".card-body");
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goto();
    await loginPage.validateLoginPage(username, password);
});

When('Add {string} to cart', async function (productName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.searchProductAddCart(productName);
    await this.dashboardPage.navigateToCart();
});

Then('Verify {string} is displayed in cart', async function (productName) {
    const cartPage = this.poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(productName);
    await cartPage.Checkout();

});

When('Enter valid details and place the order', async function () {
    const ordersReviewPage = this.poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(this.orderId);
});

Then('Verify the order is present in the OrderHistory', async function () {
    await this.poManager.getDashboardPage().navigateToOrders();
    const ordersHistoryPage = this.poManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(this.orderId);
    expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});

After(async function () {
    await this.browser?.close();
});


Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
    const userName = this.page.locator("#username");
    const signIn = this.page.locator("#signInBtn");
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await this.page.title());

    //css
    await userName.type(username);
    await this.page.locator("[type='password']").type(password);
    await signIn.click();
});


Then('Verify Error message is displayed', async function () {
    console.log(await this.page.locator("[style*='block']").textContent());
    await expect(this.page.locator("[style*='block']")).toContainText("Incorrect");
});
